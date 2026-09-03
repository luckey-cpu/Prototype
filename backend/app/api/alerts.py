import json
from pathlib import Path
from typing import List
from fastapi import APIRouter, HTTPException
from app.models.schemas import AlertItem

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

@router.get("", response_model=List[AlertItem])
def get_alerts():
    alerts_file = DATA_DIR / "alerts.json"
    if not alerts_file.exists():
        return []
    with open(alerts_file, "r", encoding="utf-8") as f:
        alerts = json.load(f)
    return [AlertItem(**a) for a in alerts]

@router.patch("/{alert_id}")
def update_alert_status(alert_id: str, status: str = "ACKNOWLEDGED"):
    alerts_file = DATA_DIR / "alerts.json"
    if not alerts_file.exists():
        raise HTTPException(status_code=404, detail="Alerts file missing.")
    with open(alerts_file, "r", encoding="utf-8") as f:
        alerts = json.load(f)
    updated = False
    for a in alerts:
        if a["id"] == alert_id:
            a["status"] = status
            updated = True
            break
    if not updated:
        raise HTTPException(status_code=404, detail="Alert not found.")
    with open(alerts_file, "w", encoding="utf-8") as f:
        json.dump(alerts, f, indent=2)
    return {"message": "Alert updated", "alert_id": alert_id, "status": status}
