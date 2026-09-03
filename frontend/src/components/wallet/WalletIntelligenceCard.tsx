import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldAlert, ArrowUpRight, ArrowDownLeft, Clock, History } from 'lucide-react';
import { WalletData } from '../../types';
import { Badge } from '../common/Badge';

interface WalletIntelligenceCardProps {
  wallet: WalletData;
}

export const WalletIntelligenceCard: React.FC<WalletIntelligenceCardProps> = ({ wallet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="glass-panel rounded-xl p-6 border-cyan-500/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Suspect Wallet Intelligence</span>
            <Badge variant="wallet" walletType={wallet.wallet_type}>
              {wallet.wallet_type}
            </Badge>
            <Badge variant="chain" blockchain={wallet.blockchain}>
              {wallet.blockchain}
            </Badge>
            <Badge variant="risk" riskLevel={wallet.risk_level}>
              {wallet.risk_level} RISK ({wallet.risk_score}/100)
            </Badge>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <h2 className="text-lg sm:text-xl font-mono font-bold text-white tracking-wide break-all">
              {wallet.address}
            </h2>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer shrink-0"
              title="Copy Address"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Explorer Link */}
        <div className="flex items-center gap-2">
          <a
            href={wallet.blockchain === 'Polygon' ? `https://polygonscan.com/address/${wallet.address}` : `https://etherscan.io/address/${wallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
          >
            <span>Block Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-6">
        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Total Transactions</p>
          <p className="text-lg font-mono font-bold text-white mt-1">
            {wallet.total_transactions.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Confirmed on chain</span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 uppercase">
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Incoming</span>
          </div>
          <p className="text-lg font-mono font-bold text-emerald-400 mt-1">
            ${wallet.incoming_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Victim deposits</span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 uppercase">
            <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
            <span>Outgoing</span>
          </div>
          <p className="text-lg font-mono font-bold text-red-400 mt-1">
            ${wallet.outgoing_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Dispersed to mules</span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 uppercase">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>First Seen</span>
          </div>
          <p className="text-sm font-mono font-bold text-slate-200 mt-1">
            {wallet.first_seen}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Creation timestamp</span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 uppercase">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Last Activity</span>
          </div>
          <p className="text-sm font-mono font-bold text-amber-300 mt-1">
            {wallet.last_activity}
          </p>
          <span className="text-[10px] text-amber-500/70 font-mono">Recent interaction</span>
        </div>
      </div>

      {/* Forensic Tags */}
      {wallet.tags && wallet.tags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400">Forensic Labels:</span>
          {wallet.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-700/40 text-[11px] font-mono text-cyan-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
