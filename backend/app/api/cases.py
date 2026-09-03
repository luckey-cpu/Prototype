import json
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from app.models.schemas import CaseItem

router = APIRouter(prefix="/api/cases", tags=["Cases"])
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

@router.get("", response_model=List[CaseItem])
def get_cases():
    cases_file = DATA_DIR / "cases.json"
    if not cases_file.exists():
        return []
    with open(cases_file, "r", encoding="utf-8") as f:
        cases = json.load(f)
    return [CaseItem(**c) for c in cases]

@router.get("/{case_id}", response_model=CaseItem)
def get_case(case_id: str):
    cases_file = DATA_DIR / "cases.json"
    if not cases_file.exists():
        raise HTTPException(status_code=404, detail="Case file missing.")
    with open(cases_file, "r", encoding="utf-8") as f:
        cases = json.load(f)
    for c in cases:
        if c["case_id"].lower() == case_id.lower():
            return CaseItem(**c)
    raise HTTPException(status_code=404, detail="Case not found.")

@router.post("", response_model=CaseItem)
def create_case(case: CaseItem):
    cases_file = DATA_DIR / "cases.json"
    cases = []
    if cases_file.exists():
        with open(cases_file, "r", encoding="utf-8") as f:
            cases = json.load(f)
            
    # Check duplicate
    for c in cases:
        if c["case_id"] == case.case_id:
            raise HTTPException(status_code=400, detail="Case ID already exists.")
            
    cases.append(case.model_dump())
    with open(cases_file, "w", encoding="utf-8") as f:
        json.dump(cases, f, indent=2)
        
    return case
