import React from 'react';
import { AlertTriangle, Clock, ShieldAlert, ArrowUpRight, Network, FileText, CheckCircle2 } from 'lucide-react';
import { AlertData } from '../../types';
import { Badge } from '../common/Badge';

interface AlertFeedProps {
  alerts: AlertData[];
  onViewCase: (caseId: string) => void;
  onViewGraph: (walletAddress: string) => void;
  onGenerateReport: (caseId: string) => void;
  onAcknowledgeAlert?: (alertId: string) => void;
}

export const AlertFeed: React.FC<AlertFeedProps> = ({
  alerts,
  onViewCase,
  onViewGraph,
  onGenerateReport,
  onAcknowledgeAlert
}) => {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const isCritical = alert.priority === 'CRITICAL';
        const isHigh = alert.priority === 'HIGH';

        return (
          <div
            key={alert.id}
            className={`glass-panel rounded-2xl p-5 border transition-all duration-200 ${
              isCritical
                ? 'border-red-500/40 bg-red-950/15 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                : isHigh
                ? 'border-orange-500/40 bg-orange-950/15'
                : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-4 h-4 ${isCritical ? 'text-red-400 animate-bounce' : 'text-orange-400'}`}
                />
                <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                  {alert.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="risk" riskLevel={alert.priority}>
                  {alert.priority} PRIORITY
                </Badge>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {alert.timestamp}
                </span>
              </div>
            </div>

            {/* Alert Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Associated Case</span>
                <span className="font-bold text-cyan-300">{alert.case_id}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Target Wallet</span>
                <span className="font-bold text-slate-200 break-all select-all">
                  {alert.wallet_address.slice(0, 8)}...{alert.wallet_address.slice(-6)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Estimated Proceeds</span>
                <span className="font-bold text-emerald-400">
                  &#8377; {alert.funds_inr.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Likely VASP Attribution</span>
                <span className="font-bold text-white">
                  {alert.likely_vasp} ({alert.confidence_pct}%)
                </span>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs font-mono text-cyan-200/90 mb-4 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-cyan-400 font-bold uppercase tracking-wider block text-[10px]">
                  Recommended Law Enforcement Action
                </span>
                <p className="mt-0.5 leading-relaxed">{alert.recommended_action}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewCase(alert.case_id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>VIEW CASE</span>
                </button>

                <button
                  onClick={() => onViewGraph(alert.wallet_address)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Network className="w-3.5 h-3.5 text-purple-400" />
                  <span>VIEW GRAPH</span>
                </button>

                <button
                  onClick={() => onGenerateReport(alert.case_id)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>GENERATE REPORT</span>
                </button>
              </div>

              {onAcknowledgeAlert && alert.status !== 'ACKNOWLEDGED' && (
                <button
                  onClick={() => onAcknowledgeAlert(alert.id)}
                  className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Acknowledged</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
