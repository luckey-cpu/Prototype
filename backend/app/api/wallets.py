from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from app.models.schemas import (
    WalletSummary, TransactionItem, GraphData, VASPAttributionResponse, BlockchainType
)
from app.services.blockchain_service import blockchain_service
from app.services.graph_service import graph_service
from app.services.risk_engine import risk_engine
from app.services.vasp_service import vasp_service

router = APIRouter(prefix="/api", tags=["Wallets"])

class AnalyzeWalletRequest(BaseModel):
    wallet_address: str
    blockchain: Optional[BlockchainType] = BlockchainType.ETHEREUM

class AnalyzeWalletResponse(BaseModel):
    wallet: WalletSummary
    risk: dict
    vasp: VASPAttributionResponse
    graph: GraphData
    transactions: List[TransactionItem]

@router.post("/analyze-wallet", response_model=AnalyzeWalletResponse)
def analyze_wallet(req: AnalyzeWalletRequest):
    address = req.wallet_address.strip()
    if not address or len(address) < 8:
        raise HTTPException(status_code=400, detail="Invalid wallet address format.")
    
    wallet = blockchain_service.get_wallet(address)
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found.")
        
    risk = risk_engine.calculate_wallet_risk(address)
    vasp = vasp_service.attribute_vasp(address)
    graph = graph_service.build_graph_for_wallet(address)
    txs = blockchain_service.get_transactions_for_wallet(address)
    
    return AnalyzeWalletResponse(
        wallet=wallet,
        risk=risk,
        vasp=vasp,
        graph=graph,
        transactions=txs
    )

@router.get("/wallet/{address}", response_model=WalletSummary)
def get_wallet(address: str):
    wallet = blockchain_service.get_wallet(address)
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found.")
    return wallet

@router.get("/wallet/{address}/transactions", response_model=List[TransactionItem])
def get_wallet_transactions(address: str):
    return blockchain_service.get_transactions_for_wallet(address)

@router.get("/wallet/{address}/graph", response_model=GraphData)
def get_wallet_graph(address: str):
    return graph_service.build_graph_for_wallet(address)

@router.get("/wallet/{address}/risk")
def get_wallet_risk(address: str):
    return risk_engine.calculate_wallet_risk(address)

@router.get("/wallet/{address}/vasp", response_model=VASPAttributionResponse)
def get_wallet_vasp(address: str):
    return vasp_service.attribute_vasp(address)
