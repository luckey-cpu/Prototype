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
            <Network className="w-6 h-6 text-blue-700" />
            <h1 className="text-2xl font-mono font-black text-slate-900 tracking-tight">
              Interactive Transaction Flow Graph
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              HERO MODULE
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Real-time directed multi-chain fund movement graph with animated flow particles and heuristic peel-chain analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewCrossChain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>CROSS-CHAIN HOP</span>
          </button>

          <button
            onClick={onViewVASP}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>VASP ATTRIBUTION</span>
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-4 text-xs font-medium text-blue-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <b>Interactive Forensics:</b> Click any <b>Node</b> to inspect wallet balance, tags, &amp; risk rating. Click any <b>Edge</b> to review hash, gas fee, and block timestamp.
          </span>
        </div>
      </div>

      {/* Hero Graph Canvas Container with Watermark */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
        {/* Immutable Chain-of-Custody Watermark Overlay */}
        <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center opacity-[0.03]">
          <div className="flex flex-col items-center justify-center -rotate-12 text-slate-900 font-mono font-bold select-none text-[32px] sm:text-[48px] lg:text-[64px] leading-tight whitespace-nowrap">
            <span className="tracking-widest">MINISTRY OF HOME AFFAIRS</span>
            <span className="text-[20px] sm:text-[28px] lg:text-[36px] mt-2">OFFICER_ID: IN-I4C-99214 &bull; IP: 10.4.11.28</span>
            <span className="text-[16px] sm:text-[20px] lg:text-[24px] mt-2">UTC+5:30 2026-09-04 10:14:22</span>
          </div>
        </div>

      {/* Hero Graph Canvas */}
        <TransactionGraph onSelectWallet={onSelectWallet} />
      </div>
    </div>
  );
};
