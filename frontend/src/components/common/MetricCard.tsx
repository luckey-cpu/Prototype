import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  color?: 'cyan' | 'red' | 'emerald' | 'amber' | 'purple';
  isNumeric?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  color = 'cyan',
  isNumeric = false
}) => {
  const [displayValue, setDisplayValue] = useState<number | string>(isNumeric ? 0 : value);

  useEffect(() => {
    if (isNumeric && typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 1200;
      const startTime = performance.now();

      const step = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.floor(easeOut * end));

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(end);
        }
      };

      requestAnimationFrame(step);
    } else {
      setDisplayValue(value);
    }
  }, [value, isNumeric]);

  const colorStyles = {
    cyan: 'border-cyan-500/20 text-cyan-400 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    red: 'border-red-500/20 text-red-400 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]',
    emerald: 'border-emerald-500/20 text-emerald-400 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    amber: 'border-amber-500/20 text-amber-400 group-hover:border-amber-500/50 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    purple: 'border-purple-500/20 text-purple-400 group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]',
  }[color];

  const iconBgStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    red: 'bg-red-500/10 text-red-400 border-red-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  }[color];

  return (
    <div className={`group glass-panel rounded-xl p-5 transition-all duration-300 relative overflow-hidden ${colorStyles}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-bold font-mono text-white tracking-tight">
              {isNumeric && typeof displayValue === 'number'
                ? displayValue.toLocaleString()
                : displayValue}
            </h3>
            {trend && (
              <span
                className={`text-xs font-mono font-medium ${
                  trendDirection === 'up'
                    ? 'text-red-400'
                    : trendDirection === 'down'
                    ? 'text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg border ${iconBgStyles}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />
    </div>
  );
};
