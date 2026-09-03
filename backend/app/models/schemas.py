from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class BlockchainType(str, Enum):
    ETHEREUM = "Ethereum"
    POLYGON = "Polygon"
    BNB = "BNB Chain"
    BITCOIN = "Bitcoin"

class WalletType(str, Enum):
    VICTIM = "Victim"
    SUSPECT = "Suspect"
    INTERMEDIARY = "Intermediary / Burner"
    BRIDGE = "Bridge / Protocol"
    DEX = "DEX"
    VASP = "Exchange / VASP"
    UNKNOWN = "Unknown"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class TransactionDirection(str, Enum):
    INCOMING = "INCOMING"
    OUTGOING = "OUTGOING"

class RiskIndicator(BaseModel):
    id: str
    code: str
    title: str
    severity: RiskLevel
    score_impact: int
    confidence: float
    timestamp: str
    explanation: str
    investigative_note: Optional[str] = None

class WalletSummary(BaseModel):
    address: str
    blockchain: BlockchainType
    wallet_type: WalletType
    risk_level: RiskLevel
    risk_score: int
    total_transactions: int
    incoming_usd: float
    outgoing_usd: float
    current_balance_usd: float
    first_seen: str
    last_activity: str
    cluster_id: Optional[str] = None
    tags: List[str] = []

class TransactionItem(BaseModel):
    tx_hash: str
    from_address: str
    to_address: str
    amount_usd: float
    amount_crypto: float
    token: str
    timestamp: str
    blockchain: BlockchainType
    block_number: int
    status: str
    direction: TransactionDirection
    risk_flag: Optional[str] = None
    gas_fee_usd: Optional[float] = None
    is_cross_chain: bool = False
    bridge_name: Optional[str] = None

class VASPEvidence(BaseModel):
    key: str
    label: str
    verified: bool
    confidence_weight: float
    description: str

class VASPCandidate(BaseModel):
    vasp_name: str
    cluster_id: str
    confidence_pct: float
    is_primary: bool
    jurisdiction: str
    le_portal_available: bool
    le_subpoena_guide: str
    deposit_pattern_match: str

class VASPAttributionResponse(BaseModel):
    wallet_address: str
    primary_vasp: VASPCandidate
    attribution_confidence: float
    candidates: List[VASPCandidate]
    evidence_checklist: List[VASPEvidence]
    disclaimer: str
    last_interaction: str

class GraphNode(BaseModel):
    id: str
    label: str
    wallet_type: WalletType
    risk_level: RiskLevel
    risk_score: int
    blockchain: BlockchainType
    balance_usd: float
    tx_count: int
    inflow_usd: float
    outflow_usd: float
    tags: List[str]

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    amount_usd: float
    amount_crypto: float
    token: str
    tx_hash: str
    timestamp: str
    is_cross_chain: bool = False
    bridge_name: Optional[str] = None
    risk_level: RiskLevel

class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class CaseItem(BaseModel):
    case_id: str
    complaint_ref: str
    complainant_name: str
    law_enforcement_unit: str
    fraud_type: str
    suspect_wallet: str
    blockchain: BlockchainType
    amount_reported_inr: float
    amount_traced_inr: float
    risk_level: RiskLevel
    status: str
    created_at: str
    last_updated: str
    assigned_officer: str

class AlertItem(BaseModel):
    id: str
    priority: RiskLevel
    title: str
    case_id: str
    wallet_address: str
    funds_inr: float
    likely_vasp: str
    confidence_pct: float
    timestamp: str
    recommended_action: str
    status: str
    blockchain: BlockchainType

class AIAnalysisRequest(BaseModel):
    wallet_address: str
    case_id: Optional[str] = None
    query: Optional[str] = None

class AIAnalysisResponse(BaseModel):
    wallet_address: str
    observed_facts: List[str]
    inferred_patterns: List[str]
    recommendations: List[str]
    procedural_notice_draft: Optional[str] = None

class ReportGenerateRequest(BaseModel):
    case_id: str
    investigator_name: str
    investigator_badge: str
    notes: Optional[str] = ""
