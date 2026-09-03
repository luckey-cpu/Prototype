import json
from pathlib import Path
from typing import Dict, Any, List
from app.models.schemas import VASPAttributionResponse, VASPCandidate, VASPEvidence

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

class VASPService:
    def __init__(self):
        self.labels: List[Dict[str, Any]] = []
        self._load_labels()
        
    def _load_labels(self):
        labels_file = DATA_DIR / "vasp_labels.json"
        if labels_file.exists():
            with open(labels_file, "r", encoding="utf-8") as f:
                self.labels = json.load(f)

    def attribute_vasp(self, address: str) -> VASPAttributionResponse:
        candidates = [
            VASPCandidate(
                vasp_name=c["vasp_name"],
                cluster_id=c["cluster_id"],
                confidence_pct=c["confidence_pct"],
                is_primary=c["is_primary"],
                jurisdiction=c["jurisdiction"],
                le_portal_available=c["le_portal_available"],
                le_subpoena_guide=c["le_subpoena_guide"],
                deposit_pattern_match=c["deposit_pattern_match"]
            )
            for c in self.labels
        ]
        
        primary = next((c for c in candidates if c.is_primary), candidates[0])
        
        # Primary evidence checklist
        primary_raw = next((c for c in self.labels if c["is_primary"]), self.labels[0])
        evidence = [
            VASPEvidence(
                key=e["key"],
                label=e["label"],
                verified=e["verified"],
                confidence_weight=e["confidence_weight"],
                description=e["description"]
            )
            for e in primary_raw.get("evidence", [])
        ]
        
        return VASPAttributionResponse(
            wallet_address=address,
            primary_vasp=primary,
            attribution_confidence=primary.confidence_pct,
            candidates=candidates,
            evidence_checklist=evidence,
            disclaimer="Attribution results are probabilistic and derived from heuristics, cluster heuristics, and transaction patterns. Requires verification by authorized investigators and appropriate legal processes (e.g. Section 91 CrPC notice).",
            last_interaction="3 minutes ago"
        )

vasp_service = VASPService()
