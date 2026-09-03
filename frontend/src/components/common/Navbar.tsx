import React from 'react';
import { Shield, Bell, Sparkles, User, Menu, X } from 'lucide-react';

interface NavbarProps {
  onLoadSample: () => void;
  unreadAlertCount: number;
  onNavigateAlerts: () => void;
  onNavigateHome: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadSample,
  unreadAlertCount,
  onNavigateAlerts,
  onNavigateHome,
  isMobileMenuOpen = false,
  onToggleMobileMenu
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#070c18]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        {/* Mobile menu toggle & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onNavigateHome}>
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-950/70 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <div className="absolute inset-0 rounded-lg border border-cyan-400/20 animate-ping opacity-25" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-base sm:text-lg font-black tracking-wider text-white">
                  BLUCE<span className="text-cyan-400">LOCK</span>
                </span>
                <span className="cyber-badge bg-cyan-950/80 text-cyan-300 border-cyan-700/60 text-[9px] py-0.2 px-1 hidden xs:inline-block">
                  LE-INTEL
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-sans text-slate-400 tracking-wide hidden sm:block">
                Law Enforcement Intelligence Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center: System Status Indicator */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">STATUS:</span>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">MULTI-CHAIN ACTIVE</span>
          </div>
        </div>

        {/* Right Controls: Demo Trigger, Alerts, Investigator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Mode Launcher */}
          <button
            onClick={onLoadSample}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer shrink-0"
            title="Load Pre-configured Investigation Case NCRP-2026-00182"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" style={{ animationDuration: '6s' }} />
            <span className="hidden md:inline">LOAD SAMPLE INVESTIGATION</span>
            <span className="md:hidden">SAMPLE DEMO</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onNavigateAlerts}
            aria-label="View Alerts"
            className="relative p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer shrink-0"
            title="Active Intelligence Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {/* Investigator Profile */}
          <div className="hidden lg:flex items-center gap-2.5 pl-2 border-l border-slate-800 shrink-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-200">Insp. V. K. Deshmukh</p>
              <p className="text-[10px] font-mono text-cyan-400/80">Cyber Forensics &bull; #CY-7819</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
