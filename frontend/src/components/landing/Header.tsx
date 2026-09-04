import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Lock, Globe } from 'lucide-react';

interface HeaderProps {
  onLoadSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoadSample }) => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white/95 backdrop-blur border-b border-slate-200/50 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded bg-slate-900 text-white shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-slate-900 leading-none mb-1">BLUE LOCK</span>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider leading-none">FORENSIC INTELLIGENCE</span>
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
          className="inline-flex items-center gap-2.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-semibold tracking-wider uppercase rounded-lg border border-slate-700 dark:border-slate-300 shadow-md hover:shadow-blue-500/10 transition-all duration-200 active:scale-95"
        >
          <Lock className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
          <span>Govt SSO Login</span>
        </button>
      </nav>
    </header>
  );
};
