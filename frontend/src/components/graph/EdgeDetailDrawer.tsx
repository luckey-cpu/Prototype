import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ArrowRight, ShieldAlert, Clock, Hash, Layers } from 'lucide-react';
import { TransactionData } from '../../types';
import { Badge } from '../common/Badge';

interface EdgeDetailDrawerProps {
  transaction: TransactionData | null;
  onClose: () => void;
}

export const EdgeDetailDrawer: React.FC<EdgeDetailDrawerProps> = ({
  transaction,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(transaction.tx_hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const shortHash = `${transaction.tx_hash.slice(0, 10)}...${transaction.tx_hash.slice(-8)}`;

  return (
    <div className="absolute inset-x-2 bottom-2 top-auto max-h-[85vh] sm:inset-x-auto sm:top-4 sm:right-4 sm:bottom-4 w-auto sm:w-80 md:w-96 glass-panel-glow rounded-2xl p-4 sm:p-5 z-30 flex flex-col justify-between border-cyan-500/30 overflow-y-auto shadow-2xl">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Transaction Edge Inspector</span>
            <span className="cyber-badge bg-cyan-950 text-cyan-400 border-cyan-800 text-[10px]">
              {transaction.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Spotlight */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 text-center">
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">Transferred Amount</p>
          <h3 className="text-2xl font-mono font-black text-white mt-1">
            ${transaction.amount_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs font-mono text-cyan-400 mt-0.5">
            {transaction.amount_crypto.toLocaleString()} {transaction.token}
          </p>

          {transaction.risk_flag && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-800 text-[10px] font-mono text-red-300">
              <ShieldAlert className="w-3 h-3 text-red-400" />
              <span>FLAG: {transaction.risk_flag}</span>
            </div>
          )}
        </div>

        {/* Transaction Flow (From -> To) */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Sender Address (From)</span>
            <p className="font-mono text-xs text-slate-300 break-all select-all">
              {transaction.from_address}
            </p>
          </div>

          <div className="flex justify-center my-1">
            <div className="p-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400">
              <ArrowRight className="w-3.5 h-3.5 rotate-90 sm:rotate-0" />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Receiver Address (To)</span>
            <p className="font-mono text-xs text-cyan-300 break-all select-all">
              {transaction.to_address}
            </p>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="mt-4 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Timestamp
            </span>
            <span className="text-slate-200">{transaction.timestamp}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-500" />
              Blockchain
            </span>
            <Badge variant="chain" blockchain={transaction.blockchain}>
              {transaction.blockchain}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1">
              <Hash className="w-3 h-3 text-slate-500" />
              Block Number
            </span>
            <span className="text-slate-200">#{transaction.block_number}</span>
          </div>

          {transaction.gas_fee_usd && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
              <span className="text-slate-400">Gas Fee Paid</span>
              <span className="text-slate-200">${transaction.gas_fee_usd.toFixed(2)} USD</span>
            </div>
          )}

          {transaction.is_cross_chain && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-purple-950/40 border border-purple-800/60">
              <span className="text-purple-300">Bridge Relayer</span>
              <span className="text-purple-200 font-bold">{transaction.bridge_name || 'Stargate Finance'}</span>
            </div>
          )}
        </div>

        {/* Transaction Hash */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Transaction Hash</span>
            <button
              onClick={handleCopyHash}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 break-all select-all border border-slate-800">
            {transaction.tx_hash}
          </p>
        </div>
      </div>

      {/* Footer Link to Explorer */}
      <div className="pt-4 border-t border-slate-800">
        <a
          href={
            transaction.blockchain === 'Polygon'
              ? `https://polygonscan.com/tx/${transaction.tx_hash}`
              : `https://etherscan.io/tx/${transaction.tx_hash}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
        >
          <span>VERIFY ON EXPLORER</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
        </a>
      </div>
    </div>
  );
};
