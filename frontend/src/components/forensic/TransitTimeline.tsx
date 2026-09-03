import React, { useState } from 'react';
import { Clock, ArrowRight, GitFork, ShieldAlert, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { DEMO_TRANSACTIONS } from '../../data/demoData';
import { TransactionData } from '../../types';

interface TransitTimelineProps {
  onSelectTx?: (tx: TransactionData) => void;
}

export const TransitTimeline: React.FC<TransitTimelineProps> = ({ onSelectTx }) => {
  const [selectedHash, setSelectedHash] = useState<string | null>(null);

  const getRiskBadge = (flag?: string) => {
    switch (flag) {
      case 'VASP_DEPOSIT_SWEEP':
      case 'LAYERING_SPLIT':
        return (
          <span className="cyber-badge bg-red-950/80 text-[#FF3366] border border-[#FF3366]/40 text-[9px] py-0.5 px-1.5 font-bold">
            CRITICAL
          </span>
        );
      case 'RAPID_FORWARDING':
      case 'BRIDGE_HOP_INITIATED':
      case 'CROSS_CHAIN_EXIT':
      case 'CONSOLIDATION_FEEDER':
        return (
          <span className="cyber-badge bg-amber-950/80 text-[#FFB703] border border-[#FFB703]/40 text-[9px] py-0.5 px-1.5 font-semibold">
            HIGH
          </span>
        );
      default:
        return (
          <span className="cyber-badge bg-cyan-950/80 text-[#00F0FF] border border-[#00F0FF]/40 text-[9px] py-0.5 px-1.5">
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
    <div className="rounded-2xl bg-[#121829] border border-[#00F0FF]/15 p-4 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#00F0FF]" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Chronological Transit Timeline
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {DEMO_TRANSACTIONS.length} Ledger Events
        </span>
      </div>

      {/* Scrollable Timeline Stream */}
      <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
        {DEMO_TRANSACTIONS.slice(0, 7).map((tx, idx) => {
          const isSelected = selectedHash === tx.tx_hash;
          return (
            <div
              key={tx.tx_hash}
              onClick={() => handleItemClick(tx)}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer text-xs font-mono select-none ${
                isSelected
                  ? 'bg-cyan-950/40 border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'bg-[#0A0E1A]/70 border-slate-800 hover:border-[#00F0FF]/30 hover:bg-slate-900/60'
              }`}
            >
              {/* Top Row: Time, Chain, and Risk Badge */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                  <span>{tx.timestamp.split(' ')[1]}</span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-slate-300 font-semibold">{tx.blockchain}</span>
                  {tx.is_cross_chain && (
                    <span className="cyber-badge bg-purple-950 text-purple-300 border-purple-800 text-[8px] py-0 px-1">
                      BRIDGE
                    </span>
                  )}
                </div>
                {getRiskBadge(tx.risk_flag)}
              </div>

              {/* Hop Movement Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-300 truncate">
                  <span className="truncate">{tx.from_address.slice(0, 6)}...{tx.from_address.slice(-4)}</span>
                  <ArrowRight className="w-3 h-3 text-[#00F0FF] shrink-0" />
                  <span className="truncate font-semibold text-white">{tx.to_address.slice(0, 6)}...{tx.to_address.slice(-4)}</span>
                </div>
                <span className="font-bold text-white shrink-0 text-right">
                  ${(tx.amount_usd).toLocaleString()} <span className="text-[10px] text-slate-400">{tx.token}</span>
                </span>
              </div>

              {/* Metadata Sub-row */}
              <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1.5 pt-1 border-t border-slate-800/60">
                <span>Block #{tx.block_number}</span>
                <span>Hop Delta: {tx.hop_delay_seconds ? `+${tx.hop_delay_seconds}s` : '0s (Origin)'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
