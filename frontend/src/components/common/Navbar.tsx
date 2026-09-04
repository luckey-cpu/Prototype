import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Lock, 
  Bell,
  Menu,
  X,
  Command
} from 'lucide-react';

interface NavbarProps {
  onLoadSample: () => void;
  unreadAlertCount: number;
  onNavigateAlerts: () => void;
  onNavigateHome: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadSample,
  unreadAlertCount,
  onNavigateAlerts,
  onNavigateHome,
  isMobileMenuOpen = false,
  onToggleMobileMenu,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // ⌘K / Ctrl+K global shortcut to focus search
  const focusSearch = useCallback(() => {
    const el = document.getElementById('global-search-input');
    el?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        focusSearch();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [focusSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-14 border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-xl px-4 flex items-center transition-all shadow-[0_1px_0_0_rgba(51,65,85,0.5)]">
      <div className="w-full flex items-center justify-between gap-4">

        {/* Left: Mobile toggle + Branding */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-blue-400" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <button onClick={onNavigateHome} className="flex items-center gap-3 group" aria-label="Return to dashboard home">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
              <ShieldAlert className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-white text-[17px] font-sans leading-none">
                BLUE<span className="text-blue-400">LOCK</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-slate-500 leading-none mt-0.5 flex items-center gap-1">
                <Lock className="h-2.5 w-2.5 text-emerald-500" />
                Sec. 65B CrPC
              </span>
            </div>
          </button>
        </div>

        {/* Center: Command Search */}
        <div className="hidden md:flex flex-1 items-center justify-center max-w-lg mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full group">
            <Search className={`absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors ${isFocused ? 'text-blue-400' : 'text-slate-500'}`} />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search address, hash, or case ID..."
              aria-label="Global search — query wallet address, transaction hash, or case ID"
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-16 text-xs text-slate-100 placeholder-slate-500 transition-all focus:border-blue-500/70 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[9px] text-slate-500">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </div>
          </form>
        </div>

        {/* Right: Status + Alerts + Profile */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Live System Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700 text-[10px] font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 font-bold tracking-wider">SYSTEM OPTIMAL</span>
          </div>

          {/* Alert Bell */}
          <button
            onClick={onNavigateAlerts}
            aria-label={`Alerts — ${unreadAlertCount} unread`}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5 rounded-full bg-red-500" />
            )}
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2.5 pl-3 border-l border-slate-800 group" aria-label="User profile">
            <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-[10px] shrink-0">
              SO
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-[11px] font-semibold text-slate-200 group-hover:text-white transition-colors leading-none">Special Officer</span>
              <span className="text-[9px] font-mono text-slate-500 mt-0.5">Badge #492</span>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};
