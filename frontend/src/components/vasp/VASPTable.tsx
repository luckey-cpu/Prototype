import React from 'react';
import { ExternalLink, ShieldCheck, Landmark } from 'lucide-react';
import { VASPCandidate } from '../../types';
import { Badge } from '../common/Badge';

interface VASPTableProps {
  candidates: VASPCandidate[];
}

export const VASPTable: React.FC<VASPTableProps> = ({ candidates }) => {
  return (
    <div className="glass-panel rounded-xl overflow-hidden border-cyan-500/20">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Ranked VASP Attribution Cluster Matrix
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Source: Global VASP Clustering Registry v2.4
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
            <tr>
              <th className="p-3.5">VASP Entity</th>
              <th className="p-3.5">Cluster ID</th>
              <th className="p-3.5">Attribution Confidence</th>
              <th className="p-3.5">Pattern Match</th>
              <th className="p-3.5">Jurisdiction</th>
              <th className="p-3.5 text-right">LE Liaison Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {candidates.map((vasp) => (
              <tr
                key={vasp.cluster_id}
                className={`hover:bg-slate-800/40 transition-colors ${
                  vasp.is_primary ? 'bg-cyan-950/15' : ''
                }`}
              >
                <td className="p-3.5 font-bold text-white flex items-center gap-2">
                  <span>{vasp.vasp_name}</span>
                  {vasp.is_primary && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                      PRIMARY
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-slate-300">{vasp.cluster_id}</td>
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${vasp.is_primary ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {vasp.confidence_pct}%
                    </span>
                    <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          vasp.is_primary ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                        style={{ width: `${vasp.confidence_pct}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-3.5 text-slate-300 max-w-[200px] truncate" title={vasp.deposit_pattern_match}>
                  {vasp.deposit_pattern_match}
                </td>
                <td className="p-3.5 text-slate-400">{vasp.jurisdiction}</td>
                <td className="p-3.5 text-right">
                  <a
                    href={vasp.le_subpoena_guide.startsWith('http') ? vasp.le_subpoena_guide : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-[10px] transition-colors"
                  >
                    <span>Section 91 Guide</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
