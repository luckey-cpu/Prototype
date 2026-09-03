import React from 'react';
import { Landmark, ShieldAlert, Sparkles } from 'lucide-react';
import { VASPCandidate } from '../../types';

interface ConfidenceMeterProps {
  primaryVASP: VASPCandidate;
  candidates: VASPCandidate[];
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ primaryVASP, candidates }) => {
  const confidence = primaryVASP.confidence_pct;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference * 0.75;

  return (
    <div className="glass-panel-glow rounded-2xl p-6 border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Primary VASP Attribution Spotlight */}
      <div className="flex-1 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-700/60 text-emerald-400 text-xs font-mono font-semibold mb-3">
          <Landmark className="w-3.5 h-3.5" />
          <span>POTENTIAL EXCHANGE-ASSOCIATED CLUSTER</span>
        </div>

        <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Likely VASP (Exchange)</p>
        <h2 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight mt-1">
          {primaryVASP.vasp_name}
        </h2>

        <p className="text-xs font-mono text-cyan-400/90 mt-1">
          Cluster ID: <span className="text-slate-200">{primaryVASP.cluster_id}</span>
        </p>

        <p className="text-xs text-slate-300 mt-3 max-w-lg leading-relaxed">
          Heuristic analysis matched high-frequency omnibus sweep transactions with registered {primaryVASP.vasp_name} hot wallet infrastructure.
        </p>

        {/* Probabilistic Disclaimer */}
        <div className="mt-4 p-2.5 rounded-lg bg-yellow-950/30 border border-yellow-800/40 text-[11px] font-mono text-yellow-300/90 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <span>Requires investigator verification. Attribution does not constitute definitive proof without Section 91 CrPC subpoena response.</span>
        </div>
      </div>

      {/* Large Circular Confidence Meter */}
      <div className="relative flex flex-col items-center justify-center shrink-0">
        <svg width="180" height="180" className="transform -rotate-135">
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#1E293B"
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#10B981"
            strokeWidth="15"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.5))',
              transition: 'stroke-dashoffset 1.2s ease-out'
            }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black font-mono text-white tracking-tight">
            {confidence}%
          </span>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest -mt-1">
            CONFIDENCE
          </span>
          <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-wide mt-1">
            HIGH PROBABILITY
          </span>
        </div>
      </div>

      {/* Other Possible VASPs Distribution */}
      <div className="w-full md:w-56 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shrink-0">
        <p className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider">Alternative Clusters</p>
        <div className="space-y-2.5">
          {candidates.filter(c => !c.is_primary).map((candidate) => (
            <div key={candidate.cluster_id}>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
                <span>{candidate.vasp_name}</span>
                <span className="font-semibold text-slate-400">{candidate.confidence_pct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-slate-500 h-1.5 rounded-full"
                  style={{ width: `${candidate.confidence_pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
