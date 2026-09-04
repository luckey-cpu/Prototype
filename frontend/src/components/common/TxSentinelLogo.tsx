import React from 'react';

interface TxSentinelLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg';
}

export const TxSentinelLogo: React.FC<TxSentinelLogoProps> = ({
  className = '',
  size = 36,
  showText = false,
  textSize = 'md'
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Cyber Hexagonal Sentinel Crest */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-blue-600/20 via-sky-500/10 to-indigo-950/40 border border-blue-500/30 shadow-[0_0_15px_rgba(56,189,248,0.25)] p-1.5 transition-transform duration-300 group-hover:scale-105 group-hover:border-blue-400/60"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]"
        >
          <defs>
            <linearGradient id="txGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="txCore" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Sentinel Shield Polygon */}
          <polygon
            points="50,6 88,24 88,68 50,94 12,68 12,24"
            fill="url(#txGradient)"
            fillOpacity="0.18"
            stroke="url(#txGradient)"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Inner Forensic Radar Nodes */}
          <circle cx="50" cy="50" r="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
          <circle cx="50" cy="50" r="6" fill="#38BDF8" />

          {/* Radiating Cryptographic Verification Paths */}
          <line x1="50" y1="20" x2="50" y2="36" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="64" x2="50" y2="80" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="24" y1="36" x2="38" y2="44" stroke="#60A5FA" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="76" y1="36" x2="62" y2="44" stroke="#60A5FA" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="24" y1="64" x2="38" y2="56" stroke="#60A5FA" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="76" y1="64" x2="62" y2="56" stroke="#60A5FA" strokeWidth="3.5" strokeLinecap="round" />

          {/* Micro-Nodes */}
          <circle cx="50" cy="18" r="3.5" fill="#38BDF8" />
          <circle cx="50" cy="82" r="3.5" fill="#38BDF8" />
          <circle cx="22" cy="34" r="3" fill="#60A5FA" />
          <circle cx="78" cy="34" r="3" fill="#60A5FA" />
          <circle cx="22" cy="66" r="3" fill="#60A5FA" />
          <circle cx="78" cy="66" r="3" fill="#60A5FA" />
        </svg>

        {/* Live Sentinel telemetry beacon */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500 border border-slate-900" />
        </span>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-black tracking-tight font-sans flex items-center leading-none ${
            textSize === 'sm' ? 'text-[17px]' : textSize === 'lg' ? 'text-2xl' : 'text-lg'
          }`}>
            <span className="text-sky-400 font-black mr-0.5">Tx</span>
            <span className="text-slate-900 dark:text-white font-black">Sentinel</span>
          </span>
          <span className="text-[9px] font-bold tracking-[0.18em] text-sky-500 dark:text-sky-400 uppercase mt-1 leading-none">
            Forensic Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
