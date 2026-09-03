import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileText, 
  ExternalLink 
} from 'lucide-react';

export interface VASPInfo {
  name: string;
  category?: string;
  confidence: number; // e.g. 91
  depositAddress: string;
  jurisdiction?: string;
  subpoenaEmail?: string;
  evidenceChecklist?: string[];
}

interface DestinationVASPCardProps {
  vasp?: VASPInfo;
  onGenerateNotice?: () => void;
}

export const DestinationVASPCard: React.FC<DestinationVASPCardProps> = ({
  vasp = {
    name: 'Binance',
    category: 'Centralized Exchange (CEX)',
    confidence: 91,
    depositAddress: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
    jurisdiction: 'Registered VASP / Global',
    subpoenaEmail: 'lawenforcement@binance.com',
    evidenceChecklist: [
      'High-degree deposit clustering verified',
      'Continuous sweep to hot wallet identified',
      'Zero contract bytecode (EOA deposit account)',
      'High-frequency inbound TX velocity (<120s)'
    ]
  },
  onGenerateNotice
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(vasp.depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header & Confidence */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                {vasp.name}
              </h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 border border-emerald-200">
                Attributed VASP
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {vasp.category} • {vasp.jurisdiction}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-xl font-bold text-emerald-600">
            {vasp.confidence}%
          </div>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            CONFIDENCE
          </span>
        </div>
      </div>

      {/* Target Deposit Address */}
      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-1 block">
          Target Deposit Address
        </span>
        <div className="flex items-center justify-between">
          <code className="font-mono text-xs font-semibold text-slate-900 select-all break-all">
            {vasp.depositAddress}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Evidentiary Checklist */}
      <div className="mt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
          EVIDENTIARY CHECKLIST
        </span>
        <ul className="space-y-1.5">
          {vasp.evidenceChecklist?.map((item, idx) => (
            <li key={idx} className="flex items-center text-xs font-medium text-slate-700">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mr-2 text-emerald-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500">
          Subpoena: <span className="font-mono text-xs text-blue-600 hover:underline cursor-pointer">{vasp.subpoenaEmail}</span>
        </span>
        <button
          type="button"
          onClick={onGenerateNotice}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-2xs hover:bg-blue-700 transition-all focus:outline-none"
        >
          <FileText className="h-3.5 w-3.5" />
          Draft Sec. 91 Notice
        </button>
      </div>
    </div>
  );
};
