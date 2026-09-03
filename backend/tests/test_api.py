import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_path = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_path))

from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "BLUCE LOCK"

def test_system_status():
    response = client.get("/api/system/status")
    assert response.status_code == 200
    data = response.json()
    assert data["system_status"] == "ONLINE"

def test_system_metrics():
    response = client.get("/api/system/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["active_cases"] == 128
    assert data["wallets_analyzed"] == 2841

def test_analyze_suspect_wallet():
    target = "0x7A2F8C91F0328b9c24090954e3d389a91f"
    response = client.post("/api/analyze-wallet", json={"wallet_address": target})
    assert response.status_code == 200
    data = response.json()
    assert data["wallet"]["address"] == target
    assert data["risk"]["risk_score"] == 87
    assert data["vasp"]["primary_vasp"]["vasp_name"] == "BINANCE"
    assert len(data["graph"]["nodes"]) >= 10
    assert len(data["graph"]["edges"]) >= 10

def test_cases_and_alerts():
    res_cases = client.get("/api/cases")
    assert res_cases.status_code == 200
    cases = res_cases.json()
    assert len(cases) >= 3

    res_alerts = client.get("/api/alerts")
    assert res_alerts.status_code == 200
    alerts = res_alerts.json()
    assert len(alerts) >= 3

def test_generate_pdf_report():
    response = client.post("/api/reports/generate", json={
        "case_id": "NCRP-2026-00182",
        "investigator_name": "Insp. V. K. Deshmukh",
        "investigator_badge": "CY-7819",
        "notes": "Automated verification test."
    })
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert len(response.content) > 1000 # Valid PDF has substantial bytes
