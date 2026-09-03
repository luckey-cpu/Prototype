import React from 'react';
import { RiskLevel, WalletType, Blockchain } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'risk' | 'wallet' | 'chain' | 'outline' | 'default';
  riskLevel?: RiskLevel;
  walletType?: WalletType;
  blockchain?: Blockchain;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  riskLevel,
  walletType,
  blockchain,
  className = ''
}) => {
  let styleClasses = 'bg-slate-800 text-slate-200 border-slate-700';

  if (variant === 'risk' && riskLevel) {
    switch (riskLevel) {
      case 'CRITICAL':
        styleClasses = 'bg-red-950/80 text-red-400 border-red-800/80 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse';
        break;
      case 'HIGH':
        styleClasses = 'bg-orange-950/80 text-orange-400 border-orange-800/80 shadow-[0_0_8px_rgba(249,115,22,0.2)]';
        break;
      case 'MEDIUM':
        styleClasses = 'bg-yellow-950/70 text-yellow-300 border-yellow-700/60';
        break;
      case 'LOW':
        styleClasses = 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60';
        break;
    }
  } else if (variant === 'wallet' && walletType) {
    switch (walletType) {
      case 'Suspect':
        styleClasses = 'bg-rose-950/80 text-rose-300 border-rose-700';
        break;
      case 'Victim':
        styleClasses = 'bg-sky-950/80 text-sky-300 border-sky-700';
        break;
      case 'Intermediary / Burner':
        styleClasses = 'bg-amber-950/80 text-amber-300 border-amber-700';
        break;
      case 'Exchange / VASP':
        styleClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-700';
        break;
      case 'Bridge / Protocol':
        styleClasses = 'bg-purple-950/80 text-purple-300 border-purple-700';
        break;
      case 'DEX':
        styleClasses = 'bg-indigo-950/80 text-indigo-300 border-indigo-700';
        break;
      default:
        styleClasses = 'bg-slate-800 text-slate-300 border-slate-700';
    }
  } else if (variant === 'chain' && blockchain) {
    switch (blockchain) {
      case 'Ethereum':
        styleClasses = 'bg-cyan-950/70 text-cyan-300 border-cyan-800';
        break;
      case 'Polygon':
        styleClasses = 'bg-purple-950/70 text-purple-300 border-purple-800';
        break;
      case 'Bitcoin':
        styleClasses = 'bg-amber-950/70 text-amber-300 border-amber-800';
        break;
      case 'BNB Chain':
        styleClasses = 'bg-yellow-950/70 text-yellow-300 border-yellow-800';
        break;
    }
  }

  return (
    <span
      className={`cyber-badge border text-xs font-mono font-medium px-2 py-0.5 rounded transition-all duration-200 ${styleClasses} ${className}`}
    >
      {children}
    </span>
  );
};
