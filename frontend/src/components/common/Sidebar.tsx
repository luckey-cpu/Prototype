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
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
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
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

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

  const filteredItems = navigationItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-1">
        
        {/* Top Slim Banner for Demo Mode */}
        {!isCollapsed && (
          <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded border border-blue-200 bg-blue-50">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-700 font-bold">
              <ShieldCheck className="w-3 h-3" />
              DEMO MODE
            </div>
            <span className="text-[9px] font-bold text-slate-700 bg-white border border-slate-200 px-1 rounded shadow-sm">SIH EVAL</span>
          </div>
        )}

        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 mb-2">
          {!isCollapsed && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> Modules
            </span>
          )}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sidebar Search Filter */}
        {!isCollapsed && (
          <div className="px-2 mb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filter modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-7 pr-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 focus:bg-white transition-colors"
              />
            </div>
          </div>
        )}

        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center justify-between py-2.5 rounded-r-lg rounded-l-sm text-xs font-mono font-bold transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 px-2'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent px-3'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.highlight && !isActive && (
                <span className="flex items-center gap-1 text-[9px] text-blue-600 font-mono bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">
                  <Flame className="w-2.5 h-2.5 text-blue-600" />
                  CORE
                </span>
              )}

              {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="flex items-center justify-center px-1.5 py-0.2 min-w-4 text-[10px] font-bold rounded-full bg-red-100 text-red-600 border border-red-200 shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle Button */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-center lg:justify-end">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className={`hidden lg:flex shrink-0 border-r border-slate-200 bg-white flex-col justify-between p-3 select-none h-[calc(100vh-3.5rem)] sticky top-14 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} shadow-sm`}>
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
        className={`fixed top-0 bottom-0 left-0 w-72 z-50 bg-white border-r border-slate-200 p-4 select-none transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >
        {navContent}
      </aside>
    </>
  );
};
