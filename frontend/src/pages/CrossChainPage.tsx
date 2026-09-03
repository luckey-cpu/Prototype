import React from 'react';
import { GitFork, Layers, Network, Building2, FileText, ArrowRight } from 'lucide-react';
import { CrossChainFlowDiagram } from '../components/crosschain/CrossChainFlowDiagram';
import { CrossChainTimeline } from '../components/crosschain/CrossChainTimeline';

interface CrossChainPageProps {
  onViewGraph: () => void;
  onViewVASP: () => void;
  onGenerateReport: () => void;
}

export const CrossChainPage: React.FC<CrossChainPageProps> = ({
  onViewGraph,
  onViewVASP,
  onGenerateReport
}) => {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-mono font-black text-white tracking-tight">
              Cross-Chain Hop &amp; Bridge Forensics
            </h1>
            <span className="cyber-badge bg-purple-950 text-purple-300 border-purple-800 text-[10px]">
              MULTI-CHAIN
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Reconstructing fund hops across independent layer-1 and layer-2 blockchains via bridge relayer protocol tracing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewGraph}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-colors cursor-pointer"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>VIEW IN GRAPH</span>
          </button>

          <button
            onClick={onViewVASP}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 hover:border-emerald-500/40 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>VASP ATTRIBUTION</span>
          </button>
        </div>
      </div>

      {/* Visual Cross-Chain Hop Pathway */}
      <CrossChainFlowDiagram />

      {/* Detailed Hop Chronology Timeline */}
      <CrossChainTimeline />
    </div>
  );
};
