import React from 'react';
import { Landmark, ShieldAlert, CheckCircle2, FileText, ArrowUpRight, Flame, Sparkles } from 'lucide-react';
import { DEMO_VASP_ATTRIBUTION } from '../../data/demoData';

interface DestinationVASPCardProps {
  onGenerateFreezeNotice: () => void;
}

export const DestinationVASPCard: React.FC<DestinationVASPCardProps> = ({
  onGenerateFreezeNotice
}) => {
  const vasp = DEMO_VASP_ATTRIBUTION.primary_vasp;
  const confidence = DEMO_VASP_ATTRIBUTION.attribution_confidence;

  return (
    <div className="rounded-2xl bg-[#121829] border border-[#00E676]/30 p-4 shadow-[0_0_25px_-5px_rgba(0,230,118,0.15)] relative overflow-hidden">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-[#00E676]" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Identified Destination VASP
          </h3>
        </div>

        <span className="cyber-badge bg-emerald-950 text-[#00E676] border border-[#00E676]/40 text-[9px] py-0.5 px-2 font-bold animate-pulse">
          VERIFIED VASP CLUSTER HIT
        </span>
      </div>

      {/* Main Attribution Spotlight */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-mono font-black text-white tracking-tight">
              {vasp.vasp_name}
            </h2>
            <span className="text-sm font-mono font-bold text-[#00E676]">
              {confidence}% Confidence
            </span>
          </div>

          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Deposit Cluster: <span className="text-slate-200">{vasp.cluster_id}</span>
          </p>
        </div>

        {/* Circular Mini Gauge */}
        <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#00E676]"
              strokeDasharray={`${confidence}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0, 230, 118, 0.6))' }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute font-mono text-[10px] font-black text-white">{confidence}%</span>
        </div>
      </div>

      {/* Heuristic Details */}
      <div className="mt-3 p-2.5 rounded-xl bg-[#0A0E1A]/80 border border-slate-800/80 text-[11px] font-mono space-y-1.5">
        <div className="flex items-start gap-1.5 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] shrink-0 mt-0.5" />
          <span className="leading-tight">Omnibus sweep to Hot Wallet #14 with multi-victim consolidation.</span>
        </div>
        <div className="flex items-start gap-1.5 text-slate-400 text-[10px]">
          <CheckCircle2 className="w-3 h-3 text-[#00E676] shrink-0 mt-0.5" />
          <span>Binance Kodex LE Portal Subpoena Gateway Available.</span>
        </div>
      </div>

      {/* One-Click Action: Generate Freeze Notice */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <button
          onClick={onGenerateFreezeNotice}
          className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold text-black bg-gradient-to-r from-[#00F0FF] to-[#00E676] hover:opacity-95 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>GENERATE FREEZE NOTICE (SEC 91/102)</span>
        </button>
      </div>
    </div>
  );
};
