import structlog
from typing import List, Dict
from app.ml.pipelines import stage1_model, stage2_model

logger = structlog.get_logger()

async def evaluate_node(address: str, transactions: List[Dict], current_hop: int) -> tuple[bool, str | None, float]:
    """
    Evaluates a node (wallet) using the dual-stage ML engine.
    Returns: (should_terminate, vasp_name, confidence)
    """
    # 1. Stage 1: Fast risk evaluation (GraphSAGE) for intermediate hops
    # We would build the local ego-graph for the real model here
    # risk_score = stage1_model.predict_risk(features, edges)
    # If risk is too low, we might not even bother extracting heavy features
    
    # 2. Stage 2: Feature extraction for terminal node classification
    features = stage2_model.extract_features(transactions)
    category, confidence = stage2_model.predict_vasp_type(features)
    
    if category == 'cex' and confidence >= 0.80:
        logger.info(
            "ML Engine identified CEX terminal node", 
            address=address, 
            confidence=confidence, 
            hop=current_hop
        )
        # Return True for early termination, and the exchange type
        # For a real implementation, we would map the 'cex' category to a known name if possible
        # or rely on known hot wallet addresses. This is a behavioral match.
        return True, "Identified_CEX", confidence
        
    return False, None, 0.0
