import React, { useState } from 'react';
import {
  FolderLock,
  Search,
  Building2,
  ShieldAlert,
  Coins,
  Clock,
  ArrowRight,
  Sparkles,
  Flame,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { Blockchain } from '../types';
import { DEMO_SUSPECT_ADDRESS, DEMO_ALERTS, DEMO_CASES } from '../data/demoData';

interface DashboardPageProps {
  onAnalyzeWallet: (address: string, chain: Blockchain) => void;
  onViewGraph: () => void;
  onViewAlerts: () => void;
  onViewCases: () => void;
  onViewReport: (caseId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onAnalyzeWallet,
  onViewGraph,
  onViewAlerts,
  onViewCases,
  onViewReport
}) => {
  const [searchAddress, setSearchAddress] = useState(DEMO_SUSPECT_ADDRESS);
  const [selectedChain, setSelectedChain] = useState<Blockchain>('Ethereum');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      onAnalyzeWallet(searchAddress.trim(), selectedChain);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">
            Crypto Fraud Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Real-time blockchain intelligence for cybercrime investigations &bull; NCRP Command Portal
          </p>
        </div>

        <button
          onClick={onViewGraph}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer self-start sm:self-auto"
        >
          <Flame className="w-4 h-4 text-black" />
          <span>OPEN TRANSACTION GRAPH</span>
        </button>
      </div>

      {/* Metric Cards Grid with Animated Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Active Cases"
          value={128}
          subtitle="NCRP registered"
          icon={FolderLock}
          color="cyan"
          isNumeric={true}
          trend="+12%"
          trendDirection="up"
        />

        <MetricCard
          title="Wallets Analyzed"
          value={2841}
          subtitle="Multi-chain ledger"
          icon={Search}
          color="cyan"
          isNumeric={true}
          trend="+8%"
          trendDirection="up"
        />

        <MetricCard
          title="VASPs Identified"
          value={174}
          subtitle="Deposit clusters"
          icon={Building2}
          color="emerald"
          isNumeric={true}
        />

        <MetricCard
          title="High Risk Wallets"
          value={89}
          subtitle="Mule & burner nodes"
          icon={ShieldAlert}
          color="red"
          isNumeric={true}
          trend="+18%"
          trendDirection="up"
        />

        <MetricCard
          title="Funds Traced"
          value="₹4.82 Cr"
          subtitle="Across 36 complaints"
          icon={Coins}
          color="amber"
          isNumeric={false}
        />

        <MetricCard
          title="Avg Analysis Time"
          value="18 sec"
          subtitle="NetworkX Graph Scan"
          icon={Clock}
          color="purple"
          isNumeric={false}
        />
      </div>

      {/* Prominent Search Bar: "Analyze Suspect Wallet" */}
      <div className="glass-panel-glow rounded-2xl p-6 border-cyan-500/30 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <h2 className="font-mono text-base font-bold text-white uppercase tracking-wider">
            Analyze Suspect Cryptocurrency Wallet
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-mono mb-4">
          Enter victim-reported wallet address to trace fund flows, map intermediaries, calculate risk score, and attribute destination VASP.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Paste suspect wallet address (e.g. 0x7A2F8C91F0328b9c24090954e3d389a91f)..."
              className="w-full bg-slate-950/90 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value as Blockchain)}
              aria-label="Select blockchain for suspect wallet search"
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-3.5 py-3 focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value="Ethereum">Ethereum</option>
              <option value="Polygon">Polygon</option>
              <option value="BNB Chain">BNB Chain</option>
              <option value="Bitcoin">Bitcoin</option>
            </select>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>ANALYZE WALLET</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Demo Fill link */}
        <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>Sample Investigated Suspect:</span>
          <button
            type="button"
            onClick={() => {
              setSearchAddress(DEMO_SUSPECT_ADDRESS);
              setSelectedChain('Ethereum');
            }}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            {DEMO_SUSPECT_ADDRESS} (Investment Scam)
          </button>
        </div>
      </div>

      {/* Bottom Section: Recent Critical Alerts & Active Dockets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts Feed */}
        <div className="glass-panel rounded-2xl p-5 border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  High-Priority Cyber Alerts
                </h3>
              </div>
              <button
                onClick={onViewAlerts}
                className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                View All Alerts &rarr;
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {DEMO_ALERTS.slice(0, 2).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-white">{alert.title}</span>
                    <span className="text-red-400 font-semibold">{alert.priority}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Case {alert.case_id} &bull; Target: {alert.wallet_address.slice(0, 8)}... &bull; VASP: <b>{alert.likely_vasp} ({alert.confidence_pct}%)</b>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    {alert.recommended_action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end">
            <button
              onClick={onViewAlerts}
              className="text-xs font-mono text-cyan-300 hover:text-cyan-200 cursor-pointer"
            >
              Open Complete Alert Center
            </button>
          </div>
        </div>

        {/* Active NCRP Cases */}
        <div className="glass-panel rounded-2xl p-5 border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Active Investigation Dockets
                </h3>
              </div>
              <button
                onClick={onViewCases}
                className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                View All Cases &rarr;
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {DEMO_CASES.slice(0, 2).map((c) => (
                <div
                  key={c.case_id}
                  onClick={() => onViewReport(c.case_id)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-cyan-400">{c.case_id}</span>
                    <span className="text-white font-semibold">&#8377; {c.amount_traced_inr.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">
                    {c.fraud_type} &bull; {c.complainant_name} &bull; Status: <span className="text-emerald-400">{c.status}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end">
            <button
              onClick={onViewCases}
              className="text-xs font-mono text-cyan-300 hover:text-cyan-200 cursor-pointer"
            >
              Open Case Management Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
