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

  let borderColor = 'border-slate-200';
  let glowColor = 'shadow-sm';
  let iconBg = 'bg-slate-100 text-slate-500 border-slate-200';
  let Icon = User;
  let typeLabel = 'Wallet';

  switch (walletType) {
    case 'Victim':
      borderColor = 'border-blue-200';
      glowColor = 'shadow-md';
      iconBg = 'bg-blue-50 text-blue-600 border-blue-200';
      Icon = User;
      typeLabel = 'Victim Inflow';
      break;
    case 'Suspect':
      borderColor = 'border-red-200';
      glowColor = 'shadow-md animate-pulse';
      iconBg = 'bg-red-50 text-red-600 border-red-200';
      Icon = AlertOctagon;
      typeLabel = 'Suspect Aggregator';
      break;
    case 'Intermediary / Burner':
      borderColor = 'border-amber-200';
      glowColor = 'shadow-md';
      iconBg = 'bg-amber-50 text-amber-600 border-amber-200';
      Icon = Repeat;
      typeLabel = 'Intermediary Mule';
      break;
    case 'Bridge / Protocol':
      borderColor = 'border-indigo-200';
      glowColor = 'shadow-md';
      iconBg = 'bg-indigo-50 text-indigo-600 border-indigo-200';
      Icon = ArrowRightLeft;
      typeLabel = 'Cross-Chain Bridge';
      break;
    case 'DEX':
      borderColor = 'border-indigo-200';
      glowColor = 'shadow-md';
      iconBg = 'bg-indigo-50 text-indigo-600 border-indigo-200';
      Icon = ArrowRightLeft;
      typeLabel = 'DEX Liquidity';
      break;
    case 'Exchange / VASP':
      borderColor = 'border-emerald-200';
      glowColor = 'shadow-md';
      iconBg = 'bg-emerald-50 text-emerald-600 border-emerald-200';
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
      className={`relative min-w-[250px] rounded-xl bg-white border ${borderColor} p-4 select-none transition-all duration-200 cursor-pointer ${
        selected
          ? 'ring-2 ring-blue-500 scale-105 ' + glowColor
          : glowColor
      }`}
    >
      {/* Target input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white"
      />

      {/* Main Node Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className={`p-1.5 rounded-lg border ${iconBg} shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="overflow-hidden text-left">
            <p className="font-mono text-[13px] font-extrabold text-slate-800 truncate max-w-[145px]" title={label}>
              {label || typeLabel}
            </p>
            <p className="font-mono text-[10px] text-slate-500 truncate" title={address}>
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
          className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
          title={expanded ? 'Collapse details' : 'Expand micro-metrics'}
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Primary Badge & Balance */}
      <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-slate-100">
        <span className="text-slate-600">Bal: ${(balanceUsd || 0).toLocaleString()}</span>
        <span
          className={`font-semibold px-1.5 py-0.2 rounded text-[9px] ${
            riskLevel === 'CRITICAL'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : riskLevel === 'HIGH'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : riskLevel === 'MEDIUM'
              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {riskScore}/100 {riskLevel}
        </span>
      </div>

      {/* Expandable Micro-Interactions Drawer in Node */}
      {expanded && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-mono space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-slate-500">
            <span>Inflow:</span>
            <span className="text-blue-600 font-bold">+${(inflowUsd || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Outflow:</span>
            <span className="text-slate-600 font-bold">-${(outflowUsd || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Transactions:</span>
            <span className="text-slate-800 font-bold">{txCount || 1} txs</span>
          </div>
          {tags && tags.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1">
              {tags.map((t, idx) => (
                <span key={idx} className="px-1 py-0.5 rounded bg-slate-50 border border-slate-200 text-[8px] text-slate-600">
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
        className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white"
      />
    </div>
  );
};

export default memo(CustomNode);
