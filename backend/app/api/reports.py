import json
from pathlib import Path
from fastapi import APIRouter, HTTPException, Response
from app.models.schemas import ReportGenerateRequest
from app.services.report_service import report_service

router = APIRouter(prefix="/api/reports", tags=["Investigation Reports"])
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

@router.post("/generate")
def generate_pdf_report(req: ReportGenerateRequest):
    try:
        pdf_bytes = report_service.generate_pdf_report(
            case_id=req.case_id,
            investigator_name=req.investigator_name or "Insp. V. K. Deshmukh",
            badge_number=req.investigator_badge or "CY-7819",
            notes=req.notes or ""
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=BLUCE_LOCK_REPORT_{req.case_id}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@router.get("/preview/{case_id}")
def get_report_preview(case_id: str):
    cases_file = DATA_DIR / "cases.json"
    if not cases_file.exists():
        raise HTTPException(status_code=404, detail="Cases file missing.")
    with open(cases_file, "r", encoding="utf-8") as f:
        cases = json.load(f)
    case_data = next((c for c in cases if c["case_id"].lower() == case_id.lower()), None)
    if not case_data:
        raise HTTPException(status_code=404, detail="Case not found.")
        
    return {
        "report_id": f"REP-BL-{case_data['case_id']}",
        "case_data": case_data,
        "classification": "CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE",
        "digital_chain_of_custody_hash": "SHA256: 8f3c9e201b4478d651a02938472910fa58b1c4e7029d5b4a8e9102c91823746a",
        "jurisdiction_notes": "Preserved under Section 65B of Indian Evidence Act / BNSS guidelines."
    }
