from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from app.ml.pipelines import stage2_model

router = APIRouter()

class ClassifyWalletRequest(BaseModel):
    wallet_address: str
    transactions: List[Dict[str, Any]]

@router.post("")
async def classify_wallet(request: ClassifyWalletRequest):
    """
    Extracts behavioral features from an address and classifies if it belongs to a Centralized Exchange (VASP).
    """
    features = stage2_model.extract_features(request.transactions)
    category, confidence = stage2_model.predict_vasp_type(features)
    
    is_vasp_deposit = (category == 'cex' and confidence >= 0.80)
    
    return {
        "wallet_address": request.wallet_address,
        "category": category,
        "confidence_score": confidence,
        "is_vasp_deposit": is_vasp_deposit
    }
