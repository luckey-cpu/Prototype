import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  ExternalLink, 
  Lock, 
  Activity, 
  ChevronRight,
  Database,
  Bell,
  Menu,
  X
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-14 border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 flex items-center transition-all shadow-sm">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Left Section: Branding & Compliance Badge */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-blue-200 cursor-pointer mr-2"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 shadow-sm">
              <ShieldAlert className="h-5 w-5" />
              {/* Live Indicator Dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tighter text-slate-900 text-xl font-sans">
                  BLUE<span className="text-blue-600">LOCK</span>
                </span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-slate-600 border border-slate-200">
                  LE PLATFORM
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-600" /> Sec. 65B CrPC Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Center Section: Breadcrumbs & Search */}
        <div className="hidden md:flex flex-1 items-center gap-4 mx-4">
          
          {/* Interactive Breadcrumbs */}
          <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono text-slate-500 border-r border-slate-200 pr-4">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Cases</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <select className="bg-transparent text-slate-700 font-bold focus:outline-none cursor-pointer appearance-none hover:text-blue-600 transition-colors">
              <option value="NCRP-00182">NCRP-00182</option>
              <option value="NCRP-00183">NCRP-00183</option>
              <option value="NCRP-00184">NCRP-00184</option>
            </select>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800">Wallet 0x7A2F...</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query Address, Hash, or Case ID..."
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-6 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1 text-[9px] text-slate-400">
              ↵
            </kbd>
          </form>
        </div>

        {/* Right Section: System Telemetry & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Grouped Telemetry Pill */}
          <div className="hidden lg:flex relative group cursor-help items-center border-r border-slate-200 pr-4">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold tracking-wider">SYSTEM OPTIMAL</span>
            </div>
            
            {/* Hover Tooltip */}
            <div className="absolute top-full right-4 mt-2 hidden group-hover:flex flex-col gap-1.5 p-2.5 bg-white border border-slate-200 rounded-lg shadow-xl min-w-[160px] z-50 text-[10px] font-mono">
               <div className="flex justify-between items-center"><span className="text-slate-500">Mainnet Sync</span> <span className="text-emerald-600 font-bold">100%</span></div>
               <div className="flex justify-between items-center"><span className="text-slate-500">Node Status</span> <span className="text-emerald-600 font-bold">Active (12)</span></div>
               <div className="flex justify-between items-center"><span className="text-slate-500">Live Ingest</span> <span className="text-emerald-600 font-bold">Connected</span></div>
            </div>
          </div>

          {/* User Profile / Alert Dropdown */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateAlerts}
              className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
              title="Active Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 shadow-sm" />
              )}
            </button>

            <button className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group">
              <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                SO
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-[10px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Special Officer</span>
                <span className="text-[9px] font-mono text-slate-500">Badge #492</span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
