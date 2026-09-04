import React, { useState } from 'react';
import {
  Download,
  Printer,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  FileText,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { CaseData } from '../../types';
import {
  DEMO_SUSPECT_ADDRESS,
  DEMO_WALLETS,
  DEMO_TRANSACTIONS,
  DEMO_RISK_INDICATORS,
  DEMO_VASP_ATTRIBUTION,
  DEMO_AI_FINDINGS,
  LE_INTEL_ATTRIBUTION_REPORT
} from '../../data/demoData';
import { reportService } from '../../services/reportService';
import { Badge } from '../common/Badge';

interface InvestigationReportPreviewProps {
  currentCase?: CaseData;
}

export const InvestigationReportPreview: React.FC<InvestigationReportPreviewProps> = ({
  currentCase
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [investigatorName, setInvestigatorName] = useState('Insp. V. K. Deshmukh');
  const [badgeNumber, setBadgeNumber] = useState('CY-7819');
  const [showAttributionReport, setShowAttributionReport] = useState(false);
  const [copiedMemorandum, setCopiedMemorandum] = useState(false);
  const [investigatorNotes, setInvestigatorNotes] = useState(
    'Mule addresses C and D are prioritized for immediate Section 102 CrPC asset freeze orders. Statutory requisition to Binance Nodal Officer drafted.'
  );

  const activeCase = currentCase || {
    case_id: 'NCRP-2026-00182',
    complaint_ref: 'CC-MAH-2026-88912',
    complainant_name: 'Rajesh Sharma',
    law_enforcement_unit: 'Pune Cyber Crime Police Station (Spl. Cell)',
    fraud_type: 'Investment Scam',
    suspect_wallet: DEMO_SUSPECT_ADDRESS,
    blockchain: 'Ethereum',
    amount_reported_inr: 842500.0,
    amount_traced_inr: 842500.0,
    risk_level: 'CRITICAL',
    status: 'Active Investigation',
    created_at: '2026-08-18 14:30:00',
    last_updated: '3 minutes ago',
    assigned_officer: 'Insp. V. K. Deshmukh (Cyber Forensics)'
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const success = await reportService.downloadPDF(activeCase.case_id, investigatorName);
      if (!success) {
        // Fallback to browser print
        window.print();
      }
    } catch {
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    reportService.printReport();
  };

  const handleExportJSON = () => {
    const exportPayload = {
      platform: 'TxSentinel',
      version: '2.4.0',
      generated_at: new Date().toISOString(),
      report_classification: 'CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE',
      case_details: activeCase,
      investigator: { name: investigatorName, badge: badgeNumber, notes: investigatorNotes },
      risk_assessment: {
        score: 87,
        level: 'CRITICAL',
        indicators: DEMO_RISK_INDICATORS
      },
      vasp_attribution: DEMO_VASP_ATTRIBUTION,
      ai_intelligence: DEMO_AI_FINDINGS,
      blockchain_trace: {
        wallets: DEMO_WALLETS,
        transactions: DEMO_TRANSACTIONS
      },
      digital_evidence_seal: {
        hash: 'SHA256: 8f3c9e201b4478d651a02938472910fa58b1c4e7029d5b4a8e9102c91823746a',
        statutory_compliance: 'Section 65B Indian Evidence Act / Section 63 Bharatiya Sakshya Adhiniyam'
      }
    };
    reportService.exportJSON(exportPayload, `TxSentinel_INTELLIGENCE_${activeCase.case_id}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-cyan-500/20 no-print">
        <div>
          <h2 className="font-mono text-base font-bold text-white uppercase tracking-wider">
            Official Forensic Intelligence Memorandum
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Standardized Law Enforcement Cryptocurrency Tracing Dossier
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>DOWNLOAD REPORT (PDF)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>PRINT REPORT</span>
          </button>

          <button
            onClick={() => setShowAttributionReport(!showAttributionReport)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              showAttributionReport
                ? 'bg-emerald-500/20 text-[#00E676] border border-[#00E676]/50'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#00E676]" />
            <span>{showAttributionReport ? 'HIDE LE-INTEL REPORT' : 'LE-INTEL ATTRIBUTION REPORT'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-purple-400" />
            <span>EXPORT JSON</span>
          </button>
        </div>
      </div>

      {/* Collapsible LE-INTEL Attribution Report View */}
      {showAttributionReport && (
        <div className="p-6 rounded-2xl bg-[#0A0E1A] border border-[#00F0FF]/30 shadow-2xl space-y-4 no-print animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00E676]" />
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                TxSentinel LE-INTEL AI | CYBER-FORENSIC ATTRIBUTION REPORT
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(LE_INTEL_ATTRIBUTION_REPORT);
                  setCopiedMemorandum(true);
                  setTimeout(() => setCopiedMemorandum(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-[#00F0FF] border border-slate-700 hover:border-[#00F0FF]/40 cursor-pointer"
              >
                {copiedMemorandum ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMemorandum ? 'COPIED TO CLIPBOARD' : 'COPY REPORT'}</span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([LE_INTEL_ATTRIBUTION_REPORT], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `TxSentinel-LE-INTEL-REPORT-${activeCase.case_id}.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>TXT</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-[#121829] border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
            {LE_INTEL_ATTRIBUTION_REPORT}
          </pre>
        </div>
      )}

      {/* Official Report Document Paper Sheet */}
      <div className="bg-[#0b1120] text-slate-100 p-8 sm:p-12 rounded-2xl border border-slate-700/80 shadow-2xl space-y-8 font-sans print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="border-b-2 border-cyan-500 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest block">
                NATIONAL CYBER CRIME INVESTIGATION WING &bull; NCRP
              </span>
              <h1 className="font-mono text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                CRYPTOCURRENCY INVESTIGATION REPORT
              </h1>
              <p className="font-mono text-xs text-slate-400 mt-1">
                Forensic Fund Tracing &bull; VASP Attribution &bull; Section 65B Evidence Draft
              </p>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-800 font-bold inline-block">
                RESTRICTED // LAW ENFORCEMENT ONLY
              </span>
              <p className="text-slate-400 mt-1 text-[11px]">Dossier ID: REP-BL-{activeCase.case_id}</p>
            </div>
          </div>
        </div>

        {/* Case Metadata Table */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Case ID</span>
            <span className="font-bold text-cyan-300">{activeCase.case_id}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Complaint Ref</span>
            <span className="font-bold text-slate-200">{activeCase.complaint_ref}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Complainant</span>
            <span className="font-bold text-slate-200">{activeCase.complainant_name}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">LE Unit</span>
            <span className="font-bold text-slate-200">{activeCase.law_enforcement_unit}</span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Fraud Category</span>
            <span className="font-bold text-white">{activeCase.fraud_type}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Reported Loss</span>
            <span className="font-bold text-slate-200">&#8377; {activeCase.amount_reported_inr.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Total Funds Traced</span>
            <span className="font-bold text-emerald-400">&#8377; {activeCase.amount_traced_inr.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Risk Classification</span>
            <span className="font-bold text-red-400">CRITICAL (87/100)</span>
          </div>
        </div>

        {/* Primary Suspect Address */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs font-mono">
          <span className="text-slate-500 text-[10px] uppercase block">Reported Suspect Cryptocurrency Wallet</span>
          <span className="font-bold text-white text-sm break-all">{activeCase.suspect_wallet}</span>
          <span className="text-slate-400 text-[11px] block mt-1">
            Blockchain: <b>{activeCase.blockchain}</b> &bull; Wallet Type: <b>Suspect Aggregator / Burner</b>
          </span>
        </div>

        {/* Section 1: VASP Attribution */}
        <div>
          <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
            <span>1. Virtual Asset Service Provider (VASP) Attribution</span>
          </h3>
          <div className="mt-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Likely Destination VASP:</span>
              <span className="font-bold text-white text-sm">BINANCE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Attribution Confidence:</span>
              <span className="font-bold text-emerald-400">91% (High Probability Cluster)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Destination Deposit Cluster:</span>
              <span className="text-cyan-300">0x28C6c06298d514Db089934071355E5743bf21d60 (Hot Wallet 14)</span>
            </div>
            <p className="text-slate-400 text-[11px] pt-2 border-t border-slate-800 leading-relaxed">
              Attribution Heuristic: Inflow matched omnibus sweep transaction pattern with common consolidation within 2 blocks.
            </p>
          </div>
        </div>

        {/* Section 2: Fund Flow & Layering Summary */}
        <div>
          <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            2. Fund Flow &amp; Layering Analysis
          </h3>
          <div className="mt-3 space-y-2 text-xs font-mono text-slate-300">
            <p className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 leading-relaxed">
              <b>Path:</b> Victim Wallets (1, 2, 3) &rarr; Suspect Aggregator (0x7A2F...91F) &rarr; Intermediaries A &amp; B &rarr; Stargate Bridge &rarr; Mule Wallet C (73% of traced funds) &rarr; Feeder Wallet D &rarr; <b>Binance Deposit Cluster</b>.
            </p>
            <p className="text-slate-400 text-[11px]">
              Cross-Chain Transfer: <b>$44,500.00 USDT</b> transferred across Ethereum &rarr; Polygon network via Stargate Finance liquidity relayer.
            </p>
          </div>
        </div>

        {/* Section 3: Explainable Risk Indicators */}
        <div>
          <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            3. Detected Fraud Risk Indicators
          </h3>
          <div className="mt-3 space-y-2 text-xs font-mono">
            {DEMO_RISK_INDICATORS.map((ind) => (
              <div key={ind.id} className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">{ind.title}</span>
                    <span className="text-slate-400 text-[11px]">{ind.explanation}</span>
                  </div>
                </div>
                <span className="font-bold text-red-400 shrink-0">+{ind.score_impact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: AI Investigative Directives */}
        <div>
          <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            4. Recommended Statutory &amp; Investigative Actions
          </h3>
          <div className="mt-3 space-y-2 text-xs font-mono text-slate-300">
            {DEMO_AI_FINDINGS.recommendations.map((rec, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 flex items-start gap-2">
                <span className="font-bold text-cyan-400">#{idx + 1}</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Investigator Notes */}
        <div className="no-print">
          <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            5. Investigating Officer Remarks
          </h3>
          <textarea
            value={investigatorNotes}
            onChange={(e) => setInvestigatorNotes(e.target.value)}
            className="w-full mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
            rows={3}
          />
        </div>

        {/* Section 6: Digital Seal & Chain of Custody Notice */}
        <div className="pt-6 border-t border-slate-800 text-xs font-mono text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Digital Forensic Hash: SHA256: 8f3c9e201b4478d651a02938472910fa58b1c4e7029d5b4a8e9102c91823746a
            </span>
            <span className="text-emerald-400 font-semibold">SEAL VERIFIED</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Preserved pursuant to Section 65B of Indian Evidence Act / Section 63 Bharatiya Sakshya Adhiniyam guidelines. Attribution results represent probabilistic analytical intelligence and require formal statutory verification.
          </p>
        </div>
      </div>
    </div>
  );
};
