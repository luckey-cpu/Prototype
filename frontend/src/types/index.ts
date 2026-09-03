export type Blockchain = 'Ethereum' | 'Bitcoin' | 'Polygon' | 'BNB Chain' | 'Solana';

export type ChainFilter = 'ALL' | 'EVM' | 'BITCOIN' | 'SOLANA' | 'BRIDGES';

export type WalletType =
  | 'Victim'
  | 'Suspect'
  | 'Intermediary / Burner'
  | 'Bridge / Protocol'
  | 'DEX'
  | 'Exchange / VASP'
  | 'Unknown';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface WalletData {
  address: string;
  blockchain: Blockchain;
  wallet_type: WalletType;
  risk_level: RiskLevel;
  risk_score: number;
  total_transactions: number;
  incoming_usd: number;
  outgoing_usd: number;
  current_balance_usd: number;
  first_seen: string;
  last_activity: string;
  cluster_id: string | null;
  tags: string[];
}

export interface TransactionData {
  tx_hash: string;
  from_address: string;
  to_address: string;
  amount_usd: number;
  amount_crypto: number;
  token: string;
  timestamp: string;
  blockchain: Blockchain;
  block_number: number;
  status: 'CONFIRMED' | 'PENDING' | 'FLAGGED';
  direction: 'INCOMING' | 'OUTGOING';
  risk_flag?: string;
  gas_fee_usd?: number;
  is_cross_chain?: boolean;
  bridge_name?: string;
  hop_delay_seconds?: number;
}

export interface RiskIndicator {
  id: string;
  code: string;
  title: string;
  severity: RiskLevel;
  score_impact: number;
  confidence: number;
  timestamp: string;
  explanation: string;
  investigative_note?: string;
}

export interface VASPEvidence {
  key: string;
  label: string;
  verified: boolean;
  confidence_weight: number;
  description: string;
}

export interface VASPCandidate {
  vasp_name: string;
  cluster_id: string;
  confidence_pct: number;
  is_primary: boolean;
  jurisdiction: string;
  le_portal_available: boolean;
  le_subpoena_guide: string;
  deposit_pattern_match: string;
  evidence?: VASPEvidence[];
}

export interface VASPAttribution {
  wallet_address: string;
  primary_vasp: VASPCandidate;
  attribution_confidence: number;
  candidates: VASPCandidate[];
  evidence_checklist: VASPEvidence[];
  disclaimer: string;
  last_interaction: string;
}

export interface CaseData {
  case_id: string;
  complaint_ref: string;
  sahyog_ack_no?: string;
  complainant_name: string;
  law_enforcement_unit: string;
  fraud_type: string;
  suspect_wallet: string;
  blockchain: Blockchain;
  amount_reported_inr: number;
  amount_traced_inr: number;
  risk_level: RiskLevel;
  status: string;
  created_at: string;
  last_updated: string;
  assigned_officer: string;
}

export interface AlertData {
  id: string;
  priority: RiskLevel;
  title: string;
  case_id: string;
  wallet_address: string;
  funds_inr: number;
  likely_vasp: string;
  confidence_pct: number;
  timestamp: string;
  recommended_action: string;
  status: 'UNREAD' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';
  blockchain: Blockchain;
}

export interface AIAnalysisResult {
  wallet_address: string;
  observed_facts: string[];
  inferred_patterns: string[];
  recommendations: string[];
  procedural_notice_draft?: string;
}

export interface FreezeNoticeData {
  notice_number: string;
  issued_under: string; // e.g. "Section 91 & Section 102 Cr.P.C. / BNSS Sec 106"
  target_vasp: string;
  deposit_cluster: string;
  suspect_wallet: string;
  complaint_id: string;
  sahyog_portal_ref: string;
  amount_inr: number;
  officer_name: string;
  officer_designation: string;
  police_station: string;
  timestamp: string;
}
