import React from 'react';
import { AlertTriangle, Clock, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { RiskIndicator } from '../../types';
import { Badge } from '../common/Badge';

interface RiskIndicatorCardProps {
  indicator: RiskIndicator;
}

export const RiskIndicatorCard: React.FC<RiskIndicatorCardProps> = ({ indicator }) => {
  const isCritical = indicator.severity === 'CRITICAL';
  const isHigh = indicator.severity === 'HIGH';

  return (
    <div
      className={`glass-panel rounded-xl p-4 transition-all duration-200 border ${
        isCritical
          ? 'border-red-500/30 hover:border-red-500/60 bg-red-950/10'
          : isHigh
          ? 'border-orange-500/30 hover:border-orange-500/60 bg-orange-950/10'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={`w-4 h-4 shrink-0 ${
              isCritical ? 'text-red-400 animate-bounce' : isHigh ? 'text-orange-400' : 'text-yellow-400'
            }`}
          />
          <h4 className="font-mono text-xs font-bold text-white tracking-wide">
            {indicator.title}
          </h4>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="risk" riskLevel={indicator.severity}>
            {indicator.severity} (+{indicator.score_impact})
          </Badge>
        </div>
      </div>

      <p className="text-xs text-slate-300 mb-3 leading-relaxed">
        {indicator.explanation}
      </p>

      {indicator.investigative_note && (
        <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-cyan-300/90 mb-3">
          <span className="text-slate-400 font-semibold">Forensic Impact: </span>
          {indicator.investigative_note}
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{indicator.timestamp}</span>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Confidence: {(indicator.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};
