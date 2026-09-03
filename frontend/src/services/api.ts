import {
  WalletData,
  TransactionData,
  RiskIndicator,
  VASPAttribution,
  CaseData,
  AlertData,
  AIAnalysisResult,
  Blockchain
} from '../types';
import {
  DEMO_WALLETS,
  DEMO_TRANSACTIONS,
  DEMO_RISK_INDICATORS,
  DEMO_VASP_ATTRIBUTION,
  DEMO_CASES,
  DEMO_ALERTS,
  DEMO_AI_FINDINGS,
  DEMO_SUSPECT_ADDRESS
} from '../data/demoData';

// When running in browser, use relative paths to leverage Vite's reverse proxy for all devices (mobile, laptop, local network)
const BASE_URL = typeof window !== 'undefined' ? '' : 'http://127.0.0.1:8000';

async function fetchWithFallback<T>(endpoint: string, options: RequestInit = {}, fallbackData: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // Fast 2.5s timeout for local FastAPI
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`API request to ${endpoint} returned status ${response.status}. Using fallback data.`);
      return fallbackData;
    }
    return await response.json();
  } catch (err) {
    // Graceful fallback to client synthetic data
    return fallbackData;
  }
}

export const api = {
  // System
  async getSystemStatus() {
    return fetchWithFallback('/api/system/status', {}, {
      platform: 'BLUCE LOCK',
      version: '2.4.0-SIH-PROTOTYPE',
      system_status: 'ONLINE',
      blockchain_nodes: {
        ethereum_rpc: 'ACTIVE (LATENCY 14ms)',
        polygon_rpc: 'ACTIVE (LATENCY 22ms)',
        bnb_rpc: 'ACTIVE (LATENCY 35ms)',
        bitcoin_rpc: 'MONITORING'
      },
      intelligence_engines: {
        vasp_attribution: 'ONLINE (Confidence Matrix v3)',
        risk_scoring_engine: 'ONLINE (Rule-Based ML Layer)',
        graph_centrality_engine: 'ONLINE (NetworkX DiGraph 3.6)',
        ai_investigator: 'ONLINE'
      }
    });
  },

  async getMetrics() {
    return fetchWithFallback('/api/system/metrics', {}, {
      active_cases: 128,
      wallets_analyzed: 2841,
      vasps_identified: 174,
      high_risk_wallets: 89,
      funds_traced_inr_crores: 4.82,
      funds_traced_formatted: '₹4.82 Cr',
      avg_analysis_time_seconds: 18
    });
  },

  // Wallets
  async getWallet(address: string): Promise<WalletData> {
    const defaultWallet = DEMO_WALLETS.find(
      w => w.address.toLowerCase() === address.toLowerCase()
    ) || {
      address,
      blockchain: 'Ethereum' as Blockchain,
      wallet_type: 'Intermediary / Burner',
      risk_level: 'HIGH',
      risk_score: 87,
      total_transactions: 1284,
      incoming_usd: 184250.0,
      outgoing_usd: 181730.0,
      current_balance_usd: 2520.0,
      first_seen: '2026-08-18',
      last_activity: '3 minutes ago',
      cluster_id: 'SUSPECT_AGGREGATOR_01',
      tags: ['Analyzed Wallet', 'Suspect Aggregator']
    };

    return fetchWithFallback(`/api/wallet/${address}`, {}, defaultWallet);
  },

  async getTransactions(address: string): Promise<TransactionData[]> {
    return fetchWithFallback(`/api/wallet/${address}/transactions`, {}, DEMO_TRANSACTIONS);
  },

  async getRisk(address: string): Promise<{ risk_score: number; risk_level: string; indicators: RiskIndicator[] }> {
    return fetchWithFallback(`/api/wallet/${address}/risk`, {}, {
      risk_score: 87,
      risk_level: 'CRITICAL',
      indicators: DEMO_RISK_INDICATORS
    });
  },

  async getVASP(address: string): Promise<VASPAttribution> {
    return fetchWithFallback(`/api/wallet/${address}/vasp`, {}, DEMO_VASP_ATTRIBUTION);
  },

  // Cases
  async getCases(): Promise<CaseData[]> {
    return fetchWithFallback('/api/cases', {}, DEMO_CASES);
  },

  async createCase(caseData: Partial<CaseData>): Promise<CaseData> {
    try {
      const response = await fetch(`${BASE_URL}/api/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData)
      });
      if (response.ok) return await response.json();
    } catch {
      // Fallback
    }
    return caseData as CaseData;
  },

  // Alerts
  async getAlerts(): Promise<AlertData[]> {
    return fetchWithFallback('/api/alerts', {}, DEMO_ALERTS);
  },

  async updateAlert(alertId: string, status: string) {
    return fetchWithFallback(`/api/alerts/${alertId}?status=${status}`, { method: 'PATCH' }, { success: true });
  },

  // AI Assistant
  async analyzeWithAI(address: string, query?: string): Promise<AIAnalysisResult> {
    return fetchWithFallback('/api/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ wallet_address: address, query })
    }, DEMO_AI_FINDINGS);
  },

  // Report Download
  async downloadReportPDF(caseId: string, investigatorName?: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${BASE_URL}/api/reports/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: caseId,
          investigator_name: investigatorName || 'Insp. V. K. Deshmukh',
          investigator_badge: 'CY-7819',
          notes: 'Generated via BLUCE LOCK Forensics Console'
        })
      });
      if (response.ok) {
        return await response.blob();
      }
    } catch {
      // Return null to allow browser print fallback
    }
    return null;
  }
};
