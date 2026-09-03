import React from 'react';
import {
  LayoutDashboard,
  Search,
  Network,
  Building2,
  GitFork,
  Bot,
  AlertTriangle,
  FolderLock,
  FileText,
  Settings,
  Flame,
  Layers,
  X
} from 'lucide-react';

export type PageId =
  | 'forensic-workspace'
  | 'dashboard'
  | 'wallet-analysis'
  | 'transaction-graph'
  | 'vasp-intelligence'
  | 'cross-chain'
  | 'ai-assistant'
  | 'alerts'
  | 'cases'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  unreadAlertCount: number;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  unreadAlertCount,
  isOpenOnMobile = false,
  onCloseMobile
}) => {
  const navigationItems = [
    { id: 'forensic-workspace' as PageId, label: 'Forensic Console (SIH)', icon: Network, highlight: true },
    { id: 'dashboard' as PageId, label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'wallet-analysis' as PageId, label: 'Wallet Risk Engine', icon: Search },
    { id: 'transaction-graph' as PageId, label: 'Full Screen Graph', icon: GitFork },
    { id: 'vasp-intelligence' as PageId, label: 'VASP Intelligence', icon: Building2 },
    { id: 'cross-chain' as PageId, label: 'Cross-Chain Bridge', icon: Layers },
    { id: 'ai-assistant' as PageId, label: 'BLUCE AI Assistant', icon: Bot },
    { id: 'alerts' as PageId, label: 'Alerts Center', icon: AlertTriangle, badge: unreadAlertCount },
    { id: 'cases' as PageId, label: 'NCRP Case Registry', icon: FolderLock },
    { id: 'reports' as PageId, label: 'Forensic Reports', icon: FileText },
    { id: 'settings' as PageId, label: 'Settings & RPC', icon: Settings },
  ];

  const handleItemClick = (pageId: PageId) => {
    onSelectPage(pageId);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-1">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Investigative Modules
          </span>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.18)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.highlight && !isActive && (
                <span className="flex items-center gap-1 text-[9px] text-cyan-400 font-mono bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                  <Flame className="w-2.5 h-2.5 text-cyan-400" />
                  CORE
                </span>
              )}

              {item.badge !== undefined && item.badge > 0 && (
                <span className="flex items-center justify-center px-1.5 py-0.2 min-w-4 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Command Center Badge */}
      <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-300 font-semibold">DEMO MODE</span>
          <span className="text-cyan-400">ACTIVE</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Operating in synthetic forensic mode for SIH evaluation.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-cyan-500/20 bg-[#070c18]/95 flex-col justify-between p-3 select-none h-[calc(100vh-4rem)] sticky top-16">
        {navContent}
      </aside>

      {/* Mobile Backdrop Overlay */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Slide-Out Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 z-50 bg-[#070c18] border-r border-cyan-500/30 p-4 select-none transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
};
