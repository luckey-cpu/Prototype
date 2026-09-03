import React from 'react';
import { ArrowRight, ArrowDown, GitFork } from 'lucide-react';

export const CrossChainFlowDiagram: React.FC = () => {
  const steps = [
    {
      chain: 'Ethereum',
      entity: 'Suspect Aggregator',
      address: '0x7A2F8C...91F',
      amount: '$45,000 USDT',
      type: 'Source Chain Deposit',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300'
    },
    {
      chain: 'Bridge Protocol',
      entity: 'Stargate Finance',
      address: '0x2F8B70...EE9',
      amount: '$44,500 USDT &rarr; USDC',
      type: 'Cross-Chain Hop',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300'
    },
    {
      chain: 'Polygon POS',
      entity: 'Mule Wallet C',
      address: '0xA15D2F...D9B',
      amount: '$44,200 USDC',
      type: 'Destination Transit',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300'
    },
    {
      chain: 'Polygon POS',
      entity: 'Feeder Wallet D',
      address: '0xB26E37...822',
      amount: '$71,500 USDC',
      type: 'Consolidation',
      color: 'border-red-500/40 bg-red-950/20 text-red-300'
    },
    {
      chain: 'Polygon POS',
      entity: 'Binance Hot 14',
      address: '0x28C6c0...1d60',
      amount: '$71,200 USDC',
      type: 'Exchange Sweep',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
    }
  ];

  return (
    <div className="glass-panel-glow rounded-2xl p-6 border-cyan-500/30">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-purple-400" />
            <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider">
              Cross-Chain Fund Flow Path
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detected chain hopping across EVM networks to obfuscate transaction trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="cyber-badge bg-purple-950/80 text-purple-300 border-purple-800">
            ETH &rarr; POLYGON
          </span>
          <span className="cyber-badge bg-red-950/80 text-red-400 border-red-800">
            HIGH RISK HOP
          </span>
        </div>
      </div>

      {/* Horizontal Flow Stages */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center relative group">
            <div className={`w-full p-4 rounded-xl border ${step.color} transition-all duration-200 group-hover:scale-105 shadow-md flex flex-col justify-between min-h-[140px]`}>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-75">
                  Step {idx + 1} &bull; {step.type}
                </span>
                <p className="font-mono font-bold text-white text-xs mt-1">
                  {step.entity}
                </p>
                <p className="font-mono text-[10px] opacity-70 mt-0.5">
                  {step.address}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60">
                <span
                  className="font-mono text-xs font-black text-white"
                  dangerouslySetInnerHTML={{ __html: step.amount }}
                />
              </div>
            </div>

            {idx < steps.length - 1 && (
              <>
                {/* Desktop horizontal arrow */}
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-slate-900 border border-slate-700 text-purple-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                {/* Mobile vertical down arrow */}
                <div className="flex md:hidden my-2 p-1 rounded-full bg-slate-900 border border-slate-700 text-purple-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
