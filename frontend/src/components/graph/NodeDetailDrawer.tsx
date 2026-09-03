import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ArrowDownLeft, ArrowUpRight, ShieldAlert, FileSearch } from 'lucide-react';
import { CustomNodeData } from './CustomNode';
import { Badge } from '../common/Badge';

interface NodeDetailDrawerProps {
  nodeData: CustomNodeData | null;
  onClose: () => void;
  onAnalyzeWallet: (address: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  nodeData,
  onClose,
  onAnalyzeWallet
}) => {
  const [copied, setCopied] = useState(false);

  if (!nodeData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(nodeData.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="absolute inset-x-2 bottom-2 top-auto max-h-[85vh] sm:inset-x-auto sm:top-4 sm:right-4 sm:bottom-4 w-auto sm:w-80 md:w-96 glass-panel-glow rounded-2xl p-4 sm:p-5 z-30 flex flex-col justify-between border-cyan-500/30 overflow-y-auto shadow-2xl">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Node Inspector</span>
            <Badge variant="wallet" walletType={nodeData.walletType}>
              {nodeData.walletType}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Info */}
        <div className="mt-4">
          <p className="text-xs font-mono text-slate-400">Entity / Label</p>
          <h3 className="text-base font-mono font-bold text-white mt-0.5">
            {nodeData.label}
          </h3>

          <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="font-mono text-xs text-slate-300 break-all select-all">
              {nodeData.address}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-slate-400 hover:text-cyan-400 cursor-pointer shrink-0 ml-2"
              title="Copy Address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Risk Score */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert
              className={`w-5 h-5 ${
                nodeData.riskLevel === 'CRITICAL' ? 'text-red-400 animate-pulse' : 'text-orange-400'
              }`}
            />
            <div>
              <p className="text-[11px] font-mono text-slate-400">Risk Assessment</p>
              <p className="text-sm font-mono font-bold text-white">{nodeData.riskLevel} RISK</p>
            </div>
          </div>
          <span className="font-mono text-xl font-black text-cyan-400">{nodeData.riskScore}/100</span>
        </div>

        {/* Financial Flow Statistics */}
        <div className="mt-4 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400">Total Transactions</span>
            <span className="font-bold text-white">{nodeData.txCount?.toLocaleString() || 12}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
              Funds Received
            </span>
            <span className="font-bold text-emerald-400">
              ${nodeData.inflowUsd?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '48,200.00'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-red-400" />
              Funds Forwarded
            </span>
            <span className="font-bold text-red-400">
              ${nodeData.outflowUsd?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '47,920.00'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400">Remaining Balance</span>
            <span className="font-bold text-cyan-300">
              ${nodeData.balanceUsd?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '280.00'}
            </span>
          </div>
        </div>

        {/* Tags */}
        {nodeData.tags && nodeData.tags.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] font-mono text-slate-400 mb-1.5 uppercase">Forensic Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {nodeData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => onAnalyzeWallet(nodeData.address)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          <FileSearch className="w-4 h-4" />
          <span>DEEP ANALYZE THIS WALLET</span>
        </button>
      </div>
    </div>
  );
};
