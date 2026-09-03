import React from 'react';
import { Clock, ShieldAlert, ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CrossChainTimeline: React.FC = () => {
  const events = [
    {
      time: '2026-08-18 12:20:00',
      title: 'Bridge Deposit Initiated on Ethereum',
      details: 'Intermediary A transferred 44,500 USDT into Stargate Finance Ethereum Router Pool.',
      txHash: '0x9f63ed324715647fd8354637845e1f3647385647385647385647385647385646',
      chain: 'Ethereum',
      status: 'CONFIRMED (Block #20561862)',
      risk: 'HIGH' as const
    },
    {
      time: '2026-08-18 12:22:15',
      title: 'LayerZero Relayer Cross-Chain Attestation',
      details: 'Decentralized Oracle and Executor attested state payload delivery to Polygon network.',
      txHash: '0x32ba817029340182390142389102389102389102389102389102389102389102',
      chain: 'Multi-Chain Protocol',
      status: 'VERIFIED',
      risk: 'MEDIUM' as const
    },
    {
      time: '2026-08-18 12:24:45',
      title: 'Bridge Mint / Release on Polygon Network',
      details: 'Stargate Polygon pool minted 44,200 USDC directly into Mule Wallet C (0xA15D...D9B).',
      txHash: '0x0a74fe4358267580e9465748956f204758496758496758496758496758496757',
      chain: 'Polygon',
      status: 'CONFIRMED (Block #61284910)',
      risk: 'CRITICAL' as const
    },
    {
      time: '2026-08-18 12:44:00',
      title: 'Polygon In-Chain Layering & Convergence',
      details: 'Wallet C consolidated funds with swapped DAI from Uniswap V3, forwarding $71,500 USDC to Wallet D.',
      txHash: '0x3da721768b5908131c7980712892537081729081729081729081729081729080',
      chain: 'Polygon',
      status: 'CONFIRMED (Block #61285140)',
      risk: 'CRITICAL' as const
    },
    {
      time: '2026-08-18 12:51:12',
      title: 'Final Omnibus Sweep to Binance Hot Wallet 14',
      details: 'Wallet D executed automated deposit consolidation sweep to identified Binance cluster.',
      txHash: '0x4eb832879c6019242d8091823903648192830192830192830192830192830191',
      chain: 'Polygon',
      status: 'CONFIRMED (Block #61285220)',
      risk: 'HIGH' as const
    }
  ];

  return (
    <div className="glass-panel rounded-xl p-6 border-cyan-500/20">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Chronological Cross-Chain Transit Timeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed hop chronology with block numbers and transaction confirmations.
          </p>
        </div>
      </div>

      <div className="relative border-l border-slate-800 ml-4 space-y-6">
        {events.map((ev, idx) => (
          <div key={idx} className="relative pl-6">
            {/* Timeline dot */}
            <div className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-purple-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-white">
                  {ev.title}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="risk" riskLevel={ev.risk}>
                    {ev.risk}
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ev.time}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {ev.details}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                <span className="text-cyan-400">{ev.chain} &bull; {ev.status}</span>
                <span className="text-slate-500 truncate max-w-[260px]" title={ev.txHash}>
                  Tx: {ev.txHash.slice(0, 16)}...
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
