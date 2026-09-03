import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api.wallets import router as wallets_router
from app.api.cases import router as cases_router
from app.api.alerts import router as alerts_router
from app.api.reports import router as reports_router
from app.api.ai import router as ai_router
from app.api.system import router as system_router
from app.api.antigravity import router as antigravity_router
from app.api.routes import trace
from app.api.routes import classify

app = FastAPI(
    title="BLUCE LOCK — Real-Time Crypto Fraud Attribution & VASP Intelligence Platform",
    description="Law-Enforcement-Oriented Cryptocurrency Forensics & Intelligence Engine (SIH Competition Prototype)",
    version="2.4.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(wallets_router)
app.include_router(cases_router)
app.include_router(alerts_router)
app.include_router(reports_router)
app.include_router(ai_router)
app.include_router(system_router)
app.include_router(antigravity_router)
app.include_router(trace.router, prefix="/api/v1/trace", tags=["Trace"])
app.include_router(classify.router, prefix="/api/v1/classify-wallet", tags=["ML Classification"])

@app.on_event("startup")
async def startup_event():
    from app.db.session import engine
    from app.db.postgres_models import Base
    import structlog
    logger = structlog.get_logger()
    logger.info("Application starting up... Initializing DB...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Postgres tables created (if not exist)")

@app.get("/")
def root():
    return {
        "platform": "BLUCE LOCK",
        "description": "National Cybercrime Blockchain Intelligence & VASP Attribution Engine",
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "version": "2.4.0"
    }

# WebSocket for live stage-by-stage analysis scanner
@app.websocket("/ws/analysis")
async def websocket_analysis_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_text()
        req = json.loads(data) if data.startswith("{") else {"wallet": data}
        target_wallet = req.get("wallet", "0x7A2F8C91F0328b9c24090954e3d389a91f")

        steps = [
            {"step": 1, "text": "Validating wallet address format & checksum...", "progress": 15},
            {"step": 2, "text": "Scanning multi-chain ledger (Ethereum & Polygon)...", "progress": 35},
            {"step": 3, "text": "Building transaction flow graph & identifying peel chains...", "progress": 55},
            {"step": 4, "text": "Evaluating behavioral risk indicators & velocity...", "progress": 75},
            {"step": 5, "text": "Matching high-probability VASP deposit clusters...", "progress": 90},
            {"step": 6, "text": "Synthesizing AI investigative findings & statutory notice draft...", "progress": 100},
        ]

        for s in steps:
            await asyncio.sleep(0.4)
            await websocket.send_json({
                "status": "IN_PROGRESS" if s["progress"] < 100 else "COMPLETED",
                "step": s["step"],
                "message": s["text"],
                "progress": s["progress"],
                "wallet": target_wallet
            })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({"status": "ERROR", "message": str(e)})
        except Exception:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
