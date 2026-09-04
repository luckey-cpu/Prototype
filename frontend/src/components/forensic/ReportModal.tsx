import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  X,
  ShieldCheck,
  Lock,
  Landmark,
  AlertTriangle,
  ArrowRight,
  GitFork,
  Scale
} from 'lucide-react';
import {
  DEMO_CASES,
  DEMO_WALLETS,
  DEMO_VASP_ATTRIBUTION,
  DEMO_NCRP_SAHYOG_ID,
  LE_INTEL_ATTRIBUTION_REPORT
} from '../../data/demoData';
import { api } from '../../services/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  caseId = 'NCRP-2026-00182'
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'raw'>('visual');

  if (!isOpen) return null;

  const currentCase = DEMO_CASES.find((c) => c.case_id === caseId) || DEMO_CASES[0];
  const custodyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const handleCopyFullReport = () => {
    navigator.clipboard.writeText(LE_INTEL_ATTRIBUTION_REPORT);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadTXT = () => {
    const blob = new Blob([LE_INTEL_ATTRIBUTION_REPORT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TxSentinel-ATTRIBUTION-REPORT-${currentCase.case_id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const blob = await api.downloadReportPDF(currentCase.case_id, currentCase.assigned_officer);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `TxSentinel-LE-REPORT-${currentCase.case_id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        window.print();
      }
    } catch {
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleExportJSON = () => {
    const reportData = {
      platform: 'TxSentinel Cybercrime Intelligence',
      case_metadata: currentCase,
      sahyog_tag: DEMO_NCRP_SAHYOG_ID,
      attribution_report: LE_INTEL_ATTRIBUTION_REPORT,
      custody_sha256: custodyHash,
      exported_at: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TxSentinel-FORENSICS-${currentCase.case_id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#121829] border border-[#00F0FF]/30 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0A0E1A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-[#00F0FF]/40 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-mono text-sm sm:text-base font-bold text-white tracking-wide">
                  TxSentinel LE-INTEL AI | CYBER-FORENSIC ATTRIBUTION REPORT
                </h3>
                <span className="cyber-badge bg-cyan-950 text-[#00F0FF] border-[#00F0FF]/40 text-[10px]">
                  SEC 91 &bull; 102 CrPC / BNSS 94 &bull; 106
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Authority: <span className="text-[#00E676] font-semibold">I4C &bull; State Cyber Police Units</span> &bull; {DEMO_NCRP_SAHYOG_ID}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="px-5 py-2 bg-[#0A0E1A]/90 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'visual'
                  ? 'bg-cyan-500/20 text-[#00F0FF] border border-[#00F0FF]/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Structured Forensic View
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'raw'
                  ? 'bg-cyan-500/20 text-[#00F0FF] border border-[#00F0FF]/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Statutory Text Memorandum
            </button>
          </div>

          {/* Custody Hash */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <Lock className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>SHA-256 Custody Seal:</span>
            <span className="text-cyan-300 select-all">{custodyHash.slice(0, 18)}...</span>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 bg-[#0A0E1A]/70 font-mono text-xs">
          {activeTab === 'raw' ? (
            /* Raw Legal Memorandum */
            <div className="p-4 rounded-xl bg-[#0A0E1A] border border-slate-800 whitespace-pre-wrap font-mono text-[11px] text-slate-200 select-all leading-relaxed">
              {LE_INTEL_ATTRIBUTION_REPORT}
            </div>
          ) : (
            /* Structured Forensic Sections */
            <>
              {/* SECTION I: CASE & STATUTORY IDENTIFIERS */}
              <div className="rounded-xl bg-[#121829] border border-[#00F0FF]/20 p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-[#00F0FF]">
                  <Scale className="w-4 h-4" />
                  <h4 className="font-bold uppercase tracking-wider text-xs">I. CASE &amp; STATUTORY IDENTIFIERS</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div className="flex justify-between p-2 rounded-lg bg-[#0A0E1A] border border-slate-800">
                    <span className="text-slate-400">NCRP Complaint Ref:</span>
                    <span className="text-white font-bold">{currentCase.complaint_ref}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#0A0E1A] border border-slate-800">
                    <span className="text-slate-400">SAHYOG Acknowledgment:</span>
                    <span className="text-cyan-300 font-bold">{currentCase.sahyog_ack_no || 'SHY-2026-449102'}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#0A0E1A] border border-slate-800">
                    <span className="text-slate-400">Target Suspect Entity:</span>
                    <span className="text-[#FF3366] font-bold select-all truncate max-w-[200px]" title={currentCase.suspect_wallet}>
                      {currentCase.suspect_wallet}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#0A0E1A] border border-slate-800">
                    <span className="text-slate-400">Classification:</span>
                    <span className="text-amber-400 font-bold">Fraud Aggregator / Burner Mule</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#0A0E1A] border border-slate-800">
                    <span className="text-slate-400">Reporting Police Station:</span>
                    <span className="text-white font-bold">{currentCase.law_enforcement_unit}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#0A0E1A] border border-slate-800">
                    <span className="text-slate-400">Total Inflow Traced:</span>
                    <span className="text-[#00F0FF] font-bold">$184,250.00 USD (~₹1.53 Cr INR)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#0A0E1A] border border-slate-800 md:col-span-2">
                    <span className="text-slate-400">Target Exchange Deposit (Frozen Target):</span>
                    <span className="text-[#00E676] font-bold text-sm">$95,450.00 USD (~₹79.70 Lakhs INR)</span>
                  </div>
                </div>
              </div>

              {/* SECTION II: FORENSIC RISK ENGINE EVALUATION */}
              <div className="rounded-xl bg-[#121829] border border-red-500/30 p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="font-bold uppercase tracking-wider text-xs">II. FORENSIC RISK ENGINE EVALUATION</h4>
                </div>

                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-between">
                  <span className="font-bold text-slate-200">COMPOSITE RISK SCORE:</span>
                  <span className="text-lg font-black text-[#FF3366] tracking-wider animate-pulse">
                    87 / 100 &mdash; CLASSIFICATION: CRITICAL
                  </span>
                </div>

                <div className="space-y-2 pt-1 text-slate-300">
                  <div className="p-2.5 rounded-lg bg-[#0A0E1A] border border-slate-800 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-white">Multi-Victim Aggregation (+15 pts | Conf: 94%):</span>
                      <p className="text-slate-400 mt-0.5">Direct inflows received from 3 distinct complainant wallets (0x1A82...f61E, 0x2B93...cD64B, 0x3C04...9B251) within a 110-minute window.</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0A0E1A] border border-slate-800 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-white">Automated Rapid Forwarding (+20 pts | Conf: 96%):</span>
                      <p className="text-slate-400 mt-0.5">Outflows executed within 195 to 425 seconds of victim credit timestamps, confirming scripted programmatic pass-through.</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0A0E1A] border border-slate-800 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-white">Structured Peel-Chain Layering (+20 pts | Conf: 92%):</span>
                      <p className="text-slate-400 mt-0.5">Tranches fragmented across Intermediaries A &amp; B (0x8B3E..., 0x9C4F...) to circumvent fiat banking AML triggers.</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0A0E1A] border border-slate-800 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-white">Cross-Chain Bridge Hopping (+12 pts | Conf: 98%):</span>
                      <p className="text-slate-400 mt-0.5">Liquidity transit via Stargate Finance (LayerZero) to break linear EVM block explorer tracing.</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0A0E1A] border border-slate-800 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-white">VASP Omnibus Sweep Signature (+20 pts | Conf: 91%):</span>
                      <p className="text-slate-400 mt-0.5">End-point fund consolidation matches centralized exchange internal omnibus deposit heuristics.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION III: RECONSTRUCTED MULTI-CHAIN FUND TRAIL */}
              <div className="rounded-xl bg-[#121829] border border-purple-500/30 p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-purple-400">
                  <GitFork className="w-4 h-4" />
                  <h4 className="font-bold uppercase tracking-wider text-xs">III. RECONSTRUCTED MULTI-CHAIN FUND TRAIL</h4>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0A0E1A] border border-slate-800/80 overflow-x-auto">
                  <pre className="font-mono text-[10px] text-slate-300 leading-relaxed">
{`[VICTIMS (1, 2, 3)] ── Inflows: $75.5k USDT (Ethereum)
        │
        ▼ (Within 110 mins)
[SUSPECT AGGREGATOR: 0x7A2F8C91F0328b9c24090954e3d389a91f]
        │
        ├──► (425s) ── $45,000 USDT ──► [INTERMEDIARY MULE A: 0x8B3E901F410Ac9D86e6Ce3F6B3475142106eDb79]
        │                                         │
        │                                         ▼ (Hop Delta: +465s)
        │                             [STARGATE BRIDGE: 0x2F8B701D21950A94F81A8cD80267Ff466bFEbEE9]
        │                                         │
        │                                         ▼ (Cross-Chain Transit: Ethereum ➔ Polygon)
        │                             [MULE C (CONVERGENCE): 0xA15D2F6B89cCb26507A94D6d54C8360f9e16cD9B]
        │                                         │
        └──► (195s) ── $28,500 USDT ──► [INTERMEDIARY MULE B: 0x9C4F1A28Ea657c918F3Bce921b72e9D906351F02]
                                                  │
                                                  ▼ (Uniswap V3 Swap: USDT ➔ DAI)
                                      [MULE C (CONVERGENCE): 0xA15D2F6B89cCb26507A94D6d54C8360f9e16cD9B]
                                                  │
                                                  ▼ (Hop Delta: +520s | Consolidation)
                                      [FEEDER MULE D: 0xB26E37A8C86095Ec10c41066D60F409C8747a822]
                                                  │
                                                  ▼ (Batch Sweep)
                        ┌────────────────────────────────────────────────────────┐
                        │   TARGET DESTINATION VASP: BINANCE (Confidence: 91%)   │
                        │   Deposit Cluster: 0x28C6c06298d514Db089934071355E5743 │
                        └────────────────────────────────────────────────────────┘`}
                  </pre>
                </div>
              </div>

              {/* SECTION IV: TARGET VASP ATTRIBUTION & FREEZE PROFILE */}
              <div className="rounded-xl bg-[#121829] border border-[#00E676]/30 p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-[#00E676]">
                  <Landmark className="w-4 h-4" />
                  <h4 className="font-bold uppercase tracking-wider text-xs">IV. TARGET VASP ATTRIBUTION &amp; FREEZE PROFILE</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-2.5 rounded-lg bg-[#0A0E1A] border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">ATTRIBUTED ENTITY:</span>
                    <span className="font-bold text-white text-sm">BINANCE (Binance Services Holdings Ltd.)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0A0E1A] border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">CONFIDENCE LEVEL:</span>
                    <span className="font-bold text-[#00E676] text-sm">91.0% (PROBABILISTIC CLUSTERING VERIFIED)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0A0E1A] border border-slate-800 md:col-span-2">
                    <span className="text-slate-400 block text-[10px]">TARGET DEPOSIT CLUSTER ADDRESS:</span>
                    <span className="font-bold text-cyan-300 text-sm select-all">0x28C6c06298d514Db089934071355E5743bf21d60</span>
                    <span className="text-slate-500 text-[10px] block mt-0.5">Network: Polygon PoS Mainnet | Cluster Identifier: VASP_BINANCE_HOT14</span>
                  </div>
                </div>

                {/* Sweep Transactions Table */}
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-[11px] text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2">Chain</th>
                        <th className="pb-2">Transaction Hash</th>
                        <th className="pb-2">Token</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Block</th>
                        <th className="pb-2">Timestamp (UTC)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="py-2 text-purple-400">Polygon</td>
                        <td className="py-2 text-cyan-300 truncate max-w-[150px]">0x4eb83287...0191</td>
                        <td className="py-2">USDC</td>
                        <td className="py-2 font-bold text-white">$71,200.00</td>
                        <td className="py-2 text-slate-400">61285220</td>
                        <td className="py-2 text-slate-400">2026-08-18 12:51:12</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-purple-400">Polygon</td>
                        <td className="py-2 text-cyan-300 truncate max-w-[150px]">0x71eb65ba...3424</td>
                        <td className="py-2">USDT</td>
                        <td className="py-2 font-bold text-white">$24,250.00</td>
                        <td className="py-2 text-slate-400">61350100</td>
                        <td className="py-2 text-slate-400">2026-08-19 14:38:40</td>
                      </tr>
                      <tr className="border-t border-slate-700 bg-slate-900/60 font-bold">
                        <td colSpan={3} className="py-2 text-right pr-4 text-slate-300">Total Consolidating Inflows Into Target Exchange:</td>
                        <td className="py-2 text-[#00E676] text-xs">$95,450.00 USD</td>
                        <td colSpan={2} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION V: STATUTORY ENFORCEMENT DIRECTIVES */}
              <div className="rounded-xl bg-[#121829] border border-cyan-500/30 p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-[#00F0FF]">
                  <ShieldCheck className="w-4 h-4" />
                  <h4 className="font-bold uppercase tracking-wider text-xs">V. STATUTORY ENFORCEMENT DIRECTIVES (FOR FIELD OFFICERS)</h4>
                </div>

                <div className="space-y-3 text-slate-300 leading-relaxed">
                  <div className="p-3 rounded-lg bg-[#0A0E1A] border border-slate-800 space-y-1.5">
                    <span className="font-bold text-red-400 block">1. Immediate Statutory Freeze Notice (Priority: CRITICAL / IMMEDIATE)</span>
                    <p className="text-slate-400 text-[11px]">
                      Issue formal Requisition Notice under Section 91 &amp; Section 102 of Cr.P.C., 1973 (or Section 94 &amp; Section 106 of Bharatiya Nagarik Suraksha Sanhita, 2023) to Binance Compliance via the Kodex LE Portal.
                    </p>
                    <ul className="list-disc list-inside text-[10px] text-slate-400 pl-2 space-y-1">
                      <li>Immediately place an administrative Debit Freeze / Lien on the internal User ID (UID) credited by Polygon Deposit Address 0x28C6c06298d514Db089934071355E5743bf21d60.</li>
                      <li>Secure certified true copies of all Know Your Customer (KYC) documentation (Government ID, passport, selfie verification, linked bank accounts, primary email, and telephone numbers).</li>
                      <li>Extract Access Logs for the past 90 days (login IPs, session cookies, device IMEIs, port numbers).</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0A0E1A] border border-slate-800 space-y-1">
                    <span className="font-bold text-purple-400 block">2. Cross-Chain Bridge Log Preservation</span>
                    <p className="text-slate-400 text-[11px]">
                      Serve a preservation order to LayerZero Labs / Stargate Relayer Operations for transaction hash 0x9f63ed324715647fd8354637845e1f3647385647385647385647385646 to identify the originating client IP address, JSON-RPC provider, and message sequencer payload.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0A0E1A] border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-400 block">3. NCRP / SAHYOG Blacklisting</span>
                    <p className="text-slate-400 text-[11px]">
                      Add the following addresses to the National Cybercrime Reporting Portal's Mule Account Registry:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-cyan-300 font-mono">
                      <span>&bull; 0x7A2F8C...91F (Suspect Aggregator)</span>
                      <span>&bull; 0x8B3E90...Eb79 (Mule Relay A)</span>
                      <span>&bull; 0x9C4F1A...1F02 (Mule Relay B)</span>
                      <span>&bull; 0xA15D2F...cD9B (Convergence Mule C)</span>
                      <span>&bull; 0xB26E37...a822 (VASP Feeder Mule D)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0A0E1A] border border-slate-800 space-y-1">
                    <span className="font-bold text-[#00E676] block">4. Evidence Certificate Generation</span>
                    <p className="text-slate-400 text-[11px]">
                      Generate and annex Certificate under Section 65-B of the Indian Evidence Act, 1872 (or Section 63 of Bharatiya Sakshya Adhiniyam, 2023) validating the electronic blockchain extract and SHA-256 digital custody seal:
                    </p>
                    <p className="font-mono text-cyan-300 text-[10px] select-all">
                      SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-[#0A0E1A]">
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            Form 65-B Indian Evidence Act / BSA Sec 63 compliant digital cyber-forensics dossier.
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyFullReport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-[#00F0FF] border border-slate-700 hover:border-[#00F0FF]/40 transition-colors cursor-pointer"
              title="Copy complete memorandum to clipboard"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReport ? 'REPORT COPIED' : 'COPY MEMORANDUM'}</span>
            </button>

            <button
              onClick={handleDownloadTXT}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD TXT</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT JSON</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT REPORT</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'GENERATING...' : 'DOWNLOAD PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
