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
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-slate-900 tracking-tight">
            Crypto Fraud Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
            Real-time blockchain intelligence for cybercrime investigations &bull; NCRP Command Portal
          </p>
        </div>

        <div className="flex items-center gap-4 self-start sm:self-auto">
          {/* INR / USD Toggle */}
          <div className="flex bg-slate-200 rounded-lg p-1">
            <button className="px-3 py-1.5 rounded-md text-xs font-bold bg-white text-blue-700 shadow-sm cursor-pointer">
              INR (₹)
            </button>
            <button className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer">
              USD ($)
            </button>
          </div>

          <button
            onClick={onViewGraph}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-md transition-all cursor-pointer"
          >
            <Flame className="w-4 h-4 text-white" />
            <span>OPEN TRANSACTION GRAPH</span>
          </button>
        </div>
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

      {/* Prominent Search Bar & NCRP Import */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Search className="w-5 h-5 text-blue-700" />
              <h2 className="font-bold text-slate-900 uppercase tracking-wider">
                Initiate Cybercrime Investigation
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Manually enter a wallet address or auto-import from the NCRP API Gateway.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200 shadow-sm hover:bg-blue-100 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FolderLock className="w-3.5 h-3.5" />
              <span>IMPORT NCRP ACK NO.</span>
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-red-50 text-red-700 font-bold text-xs border border-red-200 shadow-sm hover:bg-red-100 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>1930 RAPID FREEZE DRAWER</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Paste suspect wallet address (e.g. 0x7A2F8C91F0328b9c24090954e3d389a91f)..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value as Blockchain)}
              aria-label="Select blockchain for suspect wallet search"
              className="bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl px-3.5 py-3 focus:border-blue-500 focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="Ethereum">Ethereum</option>
              <option value="Polygon">Polygon</option>
              <option value="BNB Chain">BNB Chain</option>
              <option value="Bitcoin">Bitcoin</option>
            </select>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>ANALYZE WALLET</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Demo Fill link */}
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Sample Investigated Suspect:</span>
          <button
            type="button"
            onClick={() => {
              setSearchAddress(DEMO_SUSPECT_ADDRESS);
              setSelectedChain('Ethereum');
            }}
            className="text-blue-600 hover:underline cursor-pointer"
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
