import React from 'react';
import { RiskLevel } from '../../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, size = 180 }) => {
  const radius = size * 0.38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference * 0.75;

  let strokeColor = '#10B981'; // LOW
  let textColor = 'text-emerald-400';
  let glowColor = 'rgba(16, 185, 129, 0.4)';

  if (level === 'CRITICAL' || score >= 81) {
    strokeColor = '#EF4444';
    textColor = 'text-red-400';
    glowColor = 'rgba(239, 68, 68, 0.4)';
  } else if (level === 'HIGH' || score >= 61) {
    strokeColor = '#F97316';
    textColor = 'text-orange-400';
    glowColor = 'rgba(249, 115, 22, 0.4)';
  } else if (level === 'MEDIUM' || score >= 31) {
    strokeColor = '#FBBF24';
    textColor = 'text-yellow-400';
    glowColor = 'rgba(251, 191, 36, 0.4)';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-135">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={size * 0.08}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />

        {/* Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={size * 0.085}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 10px ${glowColor})`,
            transition: 'stroke-dashoffset 1s ease-out'
          }}
        />
      </svg>

      {/* Center Label */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl lg:text-4xl font-black font-mono tracking-tight text-white">
          {score}
        </span>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest -mt-1">
          / 100
        </span>
        <span className={`text-xs font-mono font-bold uppercase tracking-wider mt-1 ${textColor}`}>
          {level} RISK
        </span>
      </div>

      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 mt-2">
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />0-30 LOW</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />31-60 MED</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-400" />61-80 HIGH</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />81-100 CRIT</span>
      </div>
    </div>
  );
};
