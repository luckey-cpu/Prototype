import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Lock, Globe } from 'lucide-react';

import logoUrl from '../../assets/logo.jpg';

interface HeaderProps {
  onLoadSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoadSample }) => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-6">
        {/* Brand Section with New Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          {/* Custom Logo Image Container with dynamic glow */}
          <div className="relative flex items-center justify-center p-1 rounded-lg bg-blue-600/10 border border-blue-500/20 shadow-sm hover:border-blue-500/50 transition duration-300">
            <img 
              src={logoUrl}
              alt="BLUE LOCK Logo" 
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal"
            />
            {/* Subtle Cyber Glow effect under logo */}
            <div className="absolute inset-0 bg-blue-500/20 blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Brand Text */}
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
              BLUE LOCK
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-blue-400 uppercase -mt-1">
              Forensic Intelligence
            </span>
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-4" aria-label="Primary navigation">
        {/* Accessibility tools */}
        <div className="hidden md:flex items-center gap-3 border-r border-slate-200 pr-4 text-slate-600 text-[11px] font-medium">
          <button className="hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none rounded px-1" aria-label="Decrease text size">A-</button>
          <button className="hover:text-slate-900 transition-colors font-bold focus-visible:ring-2 focus-visible:ring-slate-400 outline-none rounded px-1" aria-label="Normal text size">A</button>
          <button className="hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none rounded px-1" aria-label="Increase text size">A+</button>
          <button className="flex items-center gap-1.5 ml-2 hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none rounded px-1" aria-label="Toggle language">
            <Globe className="w-3.5 h-3.5" />
            <span>EN | HI</span>
          </button>
        </div>

        {/* CTAs */}
        <button
          onClick={onLoadSample}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none shadow-sm"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span>Case Lookup</span>
        </button>
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 border border-blue-400/30 transition-all duration-200 active:scale-95"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Govt SSO Login</span>
        </button>
      </nav>
    </header>
  );
};
