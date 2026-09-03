import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { VASPEvidence } from '../../types';

interface EvidenceChecklistProps {
  evidence: VASPEvidence[];
}

export const EvidenceChecklist: React.FC<EvidenceChecklistProps> = ({ evidence }) => {
  return (
    <div className="glass-panel rounded-xl p-6 border-cyan-500/20">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-cyan-400" />
        <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
          Forensic Evidence & Cluster Matching
        </h3>
      </div>

      <div className="space-y-3">
        {evidence.map((item) => (
          <div
            key={item.key}
            className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-white">
                  {item.label}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                  Weight: {Math.round(item.confidence_weight * 100)}%
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
