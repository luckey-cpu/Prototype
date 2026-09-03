import React, { useState } from 'react';
import { Settings, ShieldCheck, Activity, Key, Lock, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [etherscanKey, setEtherscanKey] = useState('ETH_SCAN_API_DEMO_KEY_9921');
  const [polygonscanKey, setPolygonscanKey] = useState('POLYGON_SCAN_API_DEMO_KEY_4412');
  const [saved, setSaved] = useState(false);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-mono font-black text-white tracking-tight">
            System Status &amp; Investigation Platform Settings
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Node RPC connectivity, forensic API keys, law enforcement role permissions, and legal compliance.
        </p>
      </div>

      {/* System Health Status Grid */}
      <div className="glass-panel-glow rounded-2xl p-6 border-cyan-500/30 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Engine &amp; Multi-Chain Node Health
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">FastAPI Analytics Core</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-emerald-400">ONLINE (Port 8000)</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">NetworkX 3.6 &bull; ReportLab</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Ethereum RPC Node</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-emerald-400">ACTIVE (14ms)</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Mainnet Block #20577240</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Polygon PoS Gateway</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-emerald-400">ACTIVE (22ms)</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Bor Block #61350100</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">VASP Cluster Index</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-emerald-400">LOADED (v2.4)</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">174 Exchange Clusters</span>
          </div>
        </div>
      </div>

      {/* API Key Configuration */}
      <div className="glass-panel rounded-2xl p-6 border-cyan-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-5 h-5 text-cyan-400" />
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Live Blockchain Indexer API Keys
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-mono mb-4">
          Replace prototype synthetic mocks with production live explorer API credentials for real-time wallet retrieval.
        </p>

        <form onSubmit={handleSaveKeys} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-slate-300 mb-1 block">Etherscan API Key</label>
            <input
              type="text"
              value={etherscanKey}
              onChange={(e) => setEtherscanKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 mb-1 block">Polygonscan API Key</label>
            <input
              type="text"
              value={polygonscanKey}
              onChange={(e) => setPolygonscanKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved ? (
              <span className="text-emerald-400 flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>API configuration saved successfully</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer transition-colors shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              SAVE CONFIGURATION
            </button>
          </div>
        </form>
      </div>

      {/* Role-Based Access Profile */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Law Enforcement Investigator Profile &amp; Clearance
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Officer Name &amp; Rank</span>
            <span className="font-bold text-white block mt-0.5">Insp. V. K. Deshmukh</span>
            <span className="text-cyan-400 text-[10px]">Cyber Crime Spl. Cell</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Assigned System Role</span>
            <span className="font-bold text-emerald-400 block mt-0.5">LEAD INVESTIGATOR</span>
            <span className="text-slate-400 text-[10px]">Level 3 (Requisition Authorized)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Official Badge Number</span>
            <span className="font-bold text-white block mt-0.5">CY-7819</span>
            <span className="text-slate-400 text-[10px]">NCRP Verified Token</span>
          </div>
        </div>
      </div>

      {/* Security & Ethics Legal Notice */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-red-500/30 space-y-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider">
            Statutory Legal Disclaimer &amp; Evidence Protocols
          </h3>
        </div>
        <p className="text-slate-300 leading-relaxed">
          BLUCE LOCK is an investigative intelligence prototype designed exclusively for authorized law enforcement and cybercrime forensics personnel. Attribution results and risk ratings are probabilistic and require statutory verification by authorized investigating officers through appropriate legal processes (e.g., Section 91 and Section 102 of the Code of Criminal Procedure, 1973 / Bharatiya Nagarik Suraksha Sanhita).
        </p>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          This platform strictly complies with ethical AI and forensic security principles. It does not provide mechanisms for money laundering, transaction mixing, obfuscating traces, or circumventing regulatory compliance controls.
        </p>
      </div>
    </div>
  );
};
