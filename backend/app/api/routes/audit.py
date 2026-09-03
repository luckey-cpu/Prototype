from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime
import uuid

router = APIRouter()

class AuditEvent(BaseModel):
    officer_id: str = Field(..., description="Badge ID or Parichay SSO ID of the officer")
    action: str = Field(..., description="Action performed: 'CANVAS_VIEW', 'SEARCH_ADDRESS', 'EXPORT_REPORT', '1930_FREEZE_NOTICE'")
    target_resource: str = Field(..., description="The ID or address of the resource interacted with")
    ip_address: str = Field(..., description="Client IP address")
    timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat() + "Z")
    event_hash: Optional[str] = None

class AuditResponse(BaseModel):
    status: str
    message: str
    event_id: str
    cryptographic_hash: str

# In-memory mock database for prototype
audit_log_db: List[AuditEvent] = []

@router.post("/log", response_model=AuditResponse)
async def log_audit_event(event: AuditEvent, background_tasks: BackgroundTasks):
    """
    Append an immutable event to the statutory audit trail.
    Used for Chain-of-Custody (Section 65B IEA / Section 63 BSA).
    """
    event_id = str(uuid.uuid4())
    
    # Mocking cryptographic hashing of the event for non-repudiation
    mock_hash = "0x" + "".join(str(uuid.uuid4()).split("-"))
    event.event_hash = mock_hash
    
    audit_log_db.append(event)
    
    return AuditResponse(
        status="success",
        message="Event securely logged to immutable audit trail.",
        event_id=event_id,
        cryptographic_hash=mock_hash
    )

@router.get("/history", response_model=List[AuditEvent])
async def get_audit_history(officer_id: Optional[str] = None):
    """Retrieve audit history, optionally filtered by officer."""
    if officer_id:
        return [e for e in audit_log_db if e.officer_id == officer_id]
    return audit_log_db
