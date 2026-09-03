import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { User, AlertOctagon, Repeat, Landmark, ArrowRightLeft, HelpCircle, ChevronDown, ChevronUp, Layers, Activity } from 'lucide-react';
import { WalletType, RiskLevel } from '../../types';

export interface CustomNodeData {
  address: string;
  label: string;
  walletType: WalletType;
  riskLevel: RiskLevel;
  riskScore: number;
  balanceUsd: number;
  inflowUsd: number;
  outflowUsd: number;
  txCount: number;
  tags: string[];
  [key: string]: unknown;
}

const CustomNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as CustomNodeData;
  const { address, label, walletType, riskLevel, riskScore, balanceUsd, inflowUsd, outflowUsd, txCount, tags } = nodeData;
  const [expanded, setExpanded] = useState(false);

  let borderColor = 'border-slate-700';
  let glowColor = 'shadow-[0_0_15px_rgba(18,24,41,0.5)]';
  let iconBg = 'bg-slate-800 text-slate-300';
  let Icon = User;
  let typeLabel = 'Wallet';

  switch (walletType) {
    case 'Victim':
      borderColor = 'border-[#00F0FF]/60';
      glowColor = 'shadow-[0_0_20px_rgba(0,240,255,0.25)]';
      iconBg = 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40';
      Icon = User;
      typeLabel = 'Victim Inflow';
      break;
    case 'Suspect':
      borderColor = 'border-[#FF3366]';
      glowColor = 'shadow-[0_0_25px_rgba(255,51,102,0.45)] animate-pulse';
      iconBg = 'bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/50';
      Icon = AlertOctagon;
      typeLabel = 'Suspect Aggregator';
      break;
    case 'Intermediary / Burner':
      borderColor = 'border-[#FFB703]/70';
      glowColor = 'shadow-[0_0_20px_rgba(255,183,3,0.25)]';
      iconBg = 'bg-[#FFB703]/20 text-[#FFB703] border-[#FFB703]/40';
      Icon = Repeat;
      typeLabel = 'Intermediary Mule';
      break;
    case 'Bridge / Protocol':
      borderColor = 'border-[#9D4EDD]/80';
      glowColor = 'shadow-[0_0_20px_rgba(157,78,221,0.3)]';
      iconBg = 'bg-[#9D4EDD]/20 text-[#9D4EDD] border-[#9D4EDD]/40';
      Icon = ArrowRightLeft;
      typeLabel = 'Cross-Chain Bridge';
      break;
    case 'DEX':
      borderColor = 'border-indigo-500/80';
      glowColor = 'shadow-[0_0_20px_rgba(99,102,241,0.25)]';
      iconBg = 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      Icon = ArrowRightLeft;
      typeLabel = 'DEX Liquidity';
      break;
    case 'Exchange / VASP':
      borderColor = 'border-[#00E676]';
      glowColor = 'shadow-[0_0_30px_rgba(0,230,118,0.5)]';
      iconBg = 'bg-[#00E676]/20 text-[#00E676] border-[#00E676]/50';
      Icon = Landmark;
      typeLabel = 'Verified VASP Hit';
      break;
    default:
      Icon = HelpCircle;
  }

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'Unknown';

  return (
    <div
      className={`relative min-w-[220px] rounded-xl bg-[#121829] border ${borderColor} p-3 select-none transition-all duration-200 cursor-pointer ${
        selected
          ? 'ring-2 ring-[#00F0FF] scale-105 ' + glowColor
          : glowColor
      }`}
    >
      {/* Target input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-[#00F0FF] !border-2 !border-[#0A0E1A]"
      />

      {/* Main Node Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className={`p-1.5 rounded-lg border ${iconBg} shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="overflow-hidden text-left">
            <p className="font-mono text-xs font-bold text-white truncate max-w-[125px]" title={label}>
              {label || typeLabel}
            </p>
            <p className="font-mono text-[10px] text-slate-400 truncate" title={address}>
              {shortAddr}
            </p>
          </div>
        </div>

        {/* Micro-interaction toggle expand */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={expanded ? 'Collapse details' : 'Expand micro-metrics'}
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-[#00F0FF]" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Primary Badge & Balance */}
      <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-slate-800/90">
        <span className="text-slate-400">Bal: ${(balanceUsd || 0).toLocaleString()}</span>
        <span
          className={`font-semibold px-1.5 py-0.2 rounded text-[9px] ${
            riskLevel === 'CRITICAL'
              ? 'bg-red-950 text-[#FF3366] border border-[#FF3366]/50'
              : riskLevel === 'HIGH'
              ? 'bg-amber-950 text-[#FFB703] border border-[#FFB703]/50'
              : riskLevel === 'MEDIUM'
              ? 'bg-yellow-950 text-yellow-300 border border-yellow-800/50'
              : 'bg-emerald-950 text-[#00E676] border border-[#00E676]/50'
          }`}
        >
          {riskScore}/100 {riskLevel}
        </span>
      </div>

      {/* Expandable Micro-Interactions Drawer in Node */}
      {expanded && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-slate-300">
            <span>Inflow:</span>
            <span className="text-[#00F0FF] font-bold">+${(inflowUsd || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Outflow:</span>
            <span className="text-slate-300 font-bold">-${(outflowUsd || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Transactions:</span>
            <span className="text-white font-bold">{txCount || 1} txs</span>
          </div>
          {tags && tags.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1">
              {tags.map((t, idx) => (
                <span key={idx} className="px-1 py-0.5 rounded bg-slate-800 text-[8px] text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Source output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-[#00F0FF] !border-2 !border-[#0A0E1A]"
      />
    </div>
  );
};

export default memo(CustomNode);
