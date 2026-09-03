import structlog
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, validator
from web3 import Web3
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.postgres_models import Case, Suspect
from app.services.tracer import trace_suspect_wallet_task
from app.services.report_gen import generate_dossier
from datetime import datetime

logger = structlog.get_logger()
router = APIRouter()

class TraceInitiateRequest(BaseModel):
    victim_address: str
    reported_tx_hash: str
    suspect_address: str
    chain: str = "ETH"
    token_contract: str | None = None
    case_number: str
    stolen_amount: float

    @validator('suspect_address', 'victim_address')
    def validate_evm_address(cls, v, values):
        chain = values.get('chain', 'ETH')
        if chain.upper() == 'ETH':
            if not Web3.is_address(v):
                raise ValueError('Invalid EVM address format')
            return Web3.to_checksum_address(v)
        # Bitcoin Base58/Bech32 validation could go here
        return v

@router.post("/initiate")
async def initiate_trace(request: TraceInitiateRequest, db: AsyncSession = Depends(get_db)):
    """
    Initiates an asynchronous trace of a suspect wallet.
    Validates the address, tracks the case in Postgres, and triggers the Celery worker.
    """
    logger.info("Trace initiation request", case_number=request.case_number, suspect=request.suspect_address)

    # 1. Ensure Case exists or create it
    result = await db.execute(select(Case).where(Case.case_number == request.case_number))
    case = result.scalar_one_or_none()
    
    if not case:
        case = Case(case_number=request.case_number)
        db.add(case)
        await db.commit()
        await db.refresh(case)

    # 2. Log suspect in DB
    suspect = Suspect(
        case_id=case.id,
        wallet_address=request.suspect_address,
        chain=request.chain,
        reported_tx_hash=request.reported_tx_hash,
        victim_address=request.victim_address,
        stolen_amount=request.stolen_amount
    )
    db.add(suspect)
    await db.commit()
    
    # 3. Trigger Celery worker for tracing
    task = trace_suspect_wallet_task.delay(
        suspect_address=request.suspect_address,
        max_hops=4,
        min_value_threshold=0.01,
        chain=request.chain
    )
    
    logger.info("Celery trace task triggered", task_id=task.id)

    return {
        "status": "processing",
        "task_id": task.id,
        "case_number": request.case_number,
        "message": "Trace initiated and graph traversal running in background."
    }

@router.get("/report/{case_id}")
async def generate_report(case_id: str, db: AsyncSession = Depends(get_db)):
    """
    Generates a structured forensic report and Section 91 CrPC freezing request template.
    Returns: Path traversal, Evidence table, Target VASP details, Legal template.
    """
    logger.info("Generating report for case", case_number=case_id)
    
    # 1. Fetch Case and Suspect metadata from PostgreSQL
    result = await db.execute(select(Case).where(Case.case_number == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    suspect_result = await db.execute(select(Suspect).where(Suspect.case_id == case.id))
    suspects = suspect_result.scalars().all()
    
    if not suspects:
        raise HTTPException(status_code=404, detail="No suspect data found for this case")
        
    primary_suspect = suspects[0]

    # 2. In a real system, we query Neo4j for the shortest path from victim to CEX
    # Here we mock the traversal path and evidence table for the API response
    path_traversal = [
        primary_suspect.victim_address or "Victim",
        primary_suspect.wallet_address,
        "0xintermediary1",
        "0xpeelchain2",
        "0xbinance_hot_wallet"
    ]
    
    evidence_table = [
        {"tx_hash": primary_suspect.reported_tx_hash, "timestamp": "2026-09-03T10:00:00Z", "amount": primary_suspect.stolen_amount, "token": primary_suspect.chain},
        {"tx_hash": "0xmocktx_inter1", "timestamp": "2026-09-03T10:15:00Z", "amount": primary_suspect.stolen_amount * 0.99, "token": primary_suspect.chain},
        {"tx_hash": "0xmocktx_deposit", "timestamp": "2026-09-03T10:30:00Z", "amount": primary_suspect.stolen_amount * 0.95, "token": primary_suspect.chain},
    ]
    
    vasp_details = {
        "vasp_name": "Binance",
        "deposit_address": "0xbinance_hot_wallet",
        "first_seen": "2024-01-01T00:00:00Z",
        "last_seen": "2026-09-03T10:30:00Z"
    }
    
    metadata = {
        "case_number": case.case_number,
        "report_date": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # 3. Generate PDF and structured JSON
    dossier = generate_dossier(
        metadata=metadata,
        path_traversal=path_traversal,
        evidence_table=evidence_table,
        vasp_details=vasp_details
    )

    return dossier
