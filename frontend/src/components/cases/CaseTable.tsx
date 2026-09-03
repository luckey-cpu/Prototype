import React from 'react';
import { FolderLock, ExternalLink, ArrowUpRight, Search, Plus } from 'lucide-react';
import { CaseData } from '../../types';
import { Badge } from '../common/Badge';

interface CaseTableProps {
  cases: CaseData[];
  onSelectCase: (c: CaseData) => void;
  onCreateNew: () => void;
}

export const CaseTable: React.FC<CaseTableProps> = ({
  cases,
  onSelectCase,
  onCreateNew
}) => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden border-cyan-500/20">
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-cyan-400" />
            <h2 className="font-mono text-base font-bold text-white uppercase tracking-wider">
              NCRP Case Management Registry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            National Cyber Crime Reporting Portal &bull; Active Investigation Dockets
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW CASE</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Case ID & Ref</th>
              <th className="p-3.5">Fraud Category</th>
              <th className="p-3.5">Suspect Wallet</th>
              <th className="p-3.5">Reported / Traced</th>
              <th className="p-3.5">Risk Level</th>
              <th className="p-3.5">Investigation Status</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {cases.map((c) => (
              <tr
                key={c.case_id}
                className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                onClick={() => onSelectCase(c)}
              >
                <td className="p-3.5">
                  <span className="font-bold text-cyan-400 block">{c.case_id}</span>
                  <span className="text-[10px] text-slate-500">{c.complaint_ref}</span>
                </td>
                <td className="p-3.5">
                  <span className="text-slate-200 font-medium block">{c.fraud_type}</span>
                  <span className="text-[10px] text-slate-400">{c.complainant_name}</span>
                </td>
                <td className="p-3.5">
                  <span className="text-slate-300 font-mono text-[11px] block">
                    {c.suspect_wallet.slice(0, 10)}...{c.suspect_wallet.slice(-6)}
                  </span>
                  <Badge variant="chain" blockchain={c.blockchain}>
                    {c.blockchain}
                  </Badge>
                </td>
                <td className="p-3.5">
                  <span className="font-bold text-white block">
                    &#8377; {c.amount_traced_inr.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Loss: &#8377; {c.amount_reported_inr.toLocaleString()}
                  </span>
                </td>
                <td className="p-3.5">
                  <Badge variant="risk" riskLevel={c.risk_level}>
                    {c.risk_level}
                  </Badge>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-slate-300">
                    {c.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(c);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-[10px] transition-colors"
                  >
                    <span>OPEN DOCKET</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
