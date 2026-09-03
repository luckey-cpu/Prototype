from fastapi import APIRouter

router = APIRouter(prefix="/api/system", tags=["System Status"])

@router.get("/status")
def get_system_status():
    return {
        "platform": "BLUCE LOCK",
        "version": "2.4.0-SIH-PROTOTYPE",
        "system_status": "ONLINE",
        "blockchain_nodes": {
            "ethereum_rpc": "ACTIVE (LATENCY 14ms)",
            "polygon_rpc": "ACTIVE (LATENCY 22ms)",
            "bnb_rpc": "ACTIVE (LATENCY 35ms)",
            "bitcoin_rpc": "MONITORING"
        },
        "intelligence_engines": {
            "vasp_attribution": "ONLINE (Confidence Matrix v3)",
            "risk_scoring_engine": "ONLINE (Rule-Based ML Layer)",
            "graph_centrality_engine": "ONLINE (NetworkX DiGraph 3.6)",
            "ai_investigator": "ONLINE"
        },
        "disclaimer": "Attribution results are probabilistic and require formal legal verification under Section 91 CrPC."
    }

@router.get("/metrics")
def get_dashboard_metrics():
    return {
        "active_cases": 128,
        "wallets_analyzed": 2841,
        "vasps_identified": 174,
        "high_risk_wallets": 89,
        "funds_traced_inr_crores": 4.82,
        "funds_traced_formatted": "₹4.82 Cr",
        "avg_analysis_time_seconds": 18
    }
