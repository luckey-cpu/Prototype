import React, { useState } from 'react';
import { Clock, ArrowRight, ShieldAlert, Download, Filter, Copy, ExternalLink, Check } from 'lucide-react';
import { DEMO_TRANSACTIONS } from '../../data/demoData';
import { TransactionData } from '../../types';

interface TransitTimelineProps {
  onSelectTx?: (tx: TransactionData) => void;
}

export const TransitTimeline: React.FC<TransitTimelineProps> = ({ onSelectTx }) => {
  const [selectedHash, setSelectedHash] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, hash: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  const getHopDeltaColor = (delta?: number) => {
    if (!delta) return 'text-slate-500';
    if (delta < 60) return 'text-red-600 font-bold';
    if (delta < 3600) return 'text-amber-600 font-semibold';
    return 'text-emerald-600';
  };

  const getRiskBadge = (flag?: string) => {
    switch (flag) {
      case 'VASP_DEPOSIT_SWEEP':
      case 'LAYERING_SPLIT':
        return (
          <span className="cyber-badge bg-red-50 text-red-700 border border-red-200 text-[9px] py-0.5 px-1.5 font-bold">
            CRITICAL
          </span>
        );
      case 'RAPID_FORWARDING':
      case 'BRIDGE_HOP_INITIATED':
      case 'CROSS_CHAIN_EXIT':
      case 'CONSOLIDATION_FEEDER':
        return (
          <span className="cyber-badge bg-amber-50 text-amber-700 border border-amber-200 text-[9px] py-0.5 px-1.5 font-semibold">
            HIGH
          </span>
        );
      default:
        return (
          <span className="cyber-badge bg-blue-50 text-blue-700 border border-blue-200 text-[9px] py-0.5 px-1.5">
            EVIDENTIARY
          </span>
        );
    }
  };

  const handleItemClick = (tx: TransactionData) => {
    setSelectedHash(tx.tx_hash);
    if (onSelectTx) onSelectTx(tx);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <h3 className="font-mono text-xs font-bold text-slate-800 tracking-wider flex items-center gap-2">
            Transit Timeline
            <span className="flex items-center justify-center px-1.5 py-0.5 rounded-md bg-blue-100 text-[9px] text-blue-700 border border-blue-200">{DEMO_TRANSACTIONS.length} HOPS</span>
          </h3>
        </div>
        <button className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-2 py-1 rounded transition-colors cursor-pointer shadow-sm">
          <Download className="w-3 h-3 text-blue-600" />
          EXPORT CSV
        </button>
      </div>

      {/* Severity Filters */}
      <div className="flex items-center gap-1.5 mb-3 shrink-0 text-[9px] font-mono">
        <Filter className="w-3 h-3 text-slate-400 mr-1" />
        {['ALL', 'CRITICAL', 'HIGH', 'EVIDENTIARY'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${filter === f ? 'bg-blue-100 text-blue-700 border border-blue-400 font-bold' : 'text-slate-500 hover:text-slate-800 bg-white border border-slate-200 shadow-sm'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Scrollable Timeline Stream */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {DEMO_TRANSACTIONS.slice(0, 7).map((tx, idx) => {
          const isSelected = selectedHash === tx.tx_hash;
          return (
            <div
              key={tx.tx_hash}
              onClick={() => handleItemClick(tx)}
              className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer text-xs font-mono select-none group ${
                isSelected
                  ? 'bg-blue-50 border-blue-400 shadow-md ring-1 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-white'
              }`}
            >
              {/* Top Row: Time, Chain, and Risk Badge */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span title={tx.timestamp}>{tx.timestamp.split(' ')[1]}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-700 font-semibold">{tx.blockchain}</span>
                  {tx.is_cross_chain && (
                    <span className="cyber-badge bg-purple-50 text-purple-700 border-purple-200 text-[8px] py-0 px-1">
                      BRIDGE
                    </span>
                  )}
                  <div className="hidden group-hover:flex items-center gap-1 ml-1">
                    <button onClick={(e) => handleCopy(e, tx.tx_hash)} className="p-0.5 hover:text-blue-600 transition-colors text-slate-400" title="Copy Hash">
                      {copiedHash === tx.tx_hash ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <a href="#" onClick={e => e.stopPropagation()} className="p-0.5 hover:text-blue-600 transition-colors text-slate-400" title="View on Explorer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                {getRiskBadge(tx.risk_flag)}
              </div>

              {/* Hop Movement Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate">
                  <span className="truncate">{tx.from_address.slice(0, 6)}...{tx.from_address.slice(-4)}</span>
                  <ArrowRight className={`w-3 h-3 shrink-0 ${tx.is_cross_chain ? 'text-purple-600' : 'text-blue-600'}`} />
                  <span className="truncate font-semibold text-slate-800">{tx.to_address.slice(0, 6)}...{tx.to_address.slice(-4)}</span>
                </div>
                <span className="font-bold text-slate-800 shrink-0 text-right">
                  ${(tx.amount_usd).toLocaleString()} <span className="text-[9px] text-slate-500">{tx.token}</span>
                </span>
              </div>

              {/* Metadata Sub-row */}
              <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1.5 pt-1 border-t border-slate-200">
                <span>Blk #{tx.block_number}</span>
                <span>Hop Delta: <span className={getHopDeltaColor(tx.hop_delay_seconds)}>{tx.hop_delay_seconds ? `+${tx.hop_delay_seconds}s` : '0s (Origin)'}</span></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
