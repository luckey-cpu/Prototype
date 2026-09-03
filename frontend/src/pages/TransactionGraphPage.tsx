import React from 'react';
import { Network, Sparkles, Building2, GitFork, FileText, Info } from 'lucide-react';
import { TransactionGraph } from '../components/graph/TransactionGraph';

interface TransactionGraphPageProps {
  onSelectWallet: (address: string) => void;
  onViewVASP: () => void;
  onViewCrossChain: () => void;
  onGenerateReport: () => void;
}

export const TransactionGraphPage: React.FC<TransactionGraphPageProps> = ({
  onSelectWallet,
  onViewVASP,
  onViewCrossChain,
  onGenerateReport
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-mono font-black text-white tracking-tight">
              Interactive Transaction Flow Graph
            </h1>
            <span className="cyber-badge bg-cyan-950 text-cyan-300 border-cyan-700/60 text-[10px]">
              HERO MODULE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time directed multi-chain fund movement graph with animated flow particles and heuristic peel-chain analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewCrossChain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-700 hover:border-purple-500/40 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>CROSS-CHAIN HOP</span>
          </button>

          <button
            onClick={onViewVASP}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>VASP ATTRIBUTION</span>
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-4 text-xs font-mono text-cyan-200">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <b>Interactive Forensics:</b> Click any <b>Node</b> to inspect wallet balance, tags, &amp; risk rating. Click any <b>Edge</b> to review hash, gas fee, and block timestamp.
          </span>
        </div>
      </div>

      {/* Hero Graph Canvas */}
      <TransactionGraph onSelectWallet={onSelectWallet} />
    </div>
  );
};
