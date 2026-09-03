from fastapi import APIRouter
from app.models.schemas import AIAnalysisRequest, AIAnalysisResponse
from app.services.ai_service import ai_service

router = APIRouter(prefix="/api/ai", tags=["AI Investigation Assistant"])

@router.post("/analyze", response_model=AIAnalysisResponse)
def analyze_with_ai(req: AIAnalysisRequest):
    return ai_service.analyze_case(wallet_address=req.wallet_address, query=req.query)
