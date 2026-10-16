import React from 'react';
import { NavTabId } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onSelectTab: (tab: NavTabId) => void;
  onToggleNotifications: () => void;
  notificationsOpen: boolean;
  unreadCount: number;
  onOpenQuickAdd: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDesktopWindowMode: boolean;
  onToggleWindowMode: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTab,
  onToggleNotifications,
  notificationsOpen,
  unreadCount,
  onOpenQuickAdd,
  searchQuery,
  onSearchChange,
  isDesktopWindowMode,
  onToggleWindowMode,
  onOpenAuth,
}) => {
  const { user, profile } = useAuth();

  return (
    <header className="h-16 px-6 lg:px-8 flex items-center justify-between bg-[#f9f9f7]/95 backdrop-blur-md z-30 shrink-0 border-b border-[#151618]/5">
      {/* Brand & Mode */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-[#151618] text-white flex items-center justify-center font-outfit font-bold text-sm shadow-sm">
            G
          </div>
          <span className="font-outfit font-semibold text-base lg:text-lg text-[#151618] tracking-tight group-hover:text-black transition-colors">
            GOWRISH OS
          </span>
        </button>
        <span className="px-3 py-0.5 rounded-full bg-[#d5e4f3] text-[#0f1d27] text-[10px] font-sora font-semibold uppercase tracking-wider hidden sm:inline-block">
          Life Command
        </span>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3.5 text-[#77777b] text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                onOpenQuickAdd();
              }
            }}
            placeholder="Search commands, tasks, notes, sessions (Cmd+K)..."
            className="w-full pl-10 pr-12 py-2 text-xs font-outfit bg-white/80 rounded-full text-[#1a1c1b] placeholder:text-[#77777b] border border-black/5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C9D8E6] transition-all shadow-sm"
          />
          <button
            onClick={onOpenQuickAdd}
            className="absolute right-2 px-2 py-0.5 bg-[#f4f4f2] text-[#77777b] hover:text-[#1a1c1b] rounded-full text-[10px] font-sora font-medium border border-black/5"
            title="Open Quick Add Modal"
          >
            ⌘K
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Toggle Window/Desktop presentation mode */}
        <button
          onClick={onToggleWindowMode}
          className="w-9 h-9 rounded-full hidden sm:flex items-center justify-center text-[#77777b] hover:text-[#151618] hover:bg-black/5 transition-colors"
          title={isDesktopWindowMode ? 'Maximize to Full Viewport' : 'Switch to Floating Desktop Window'}
        >
          <span className="material-symbols-outlined text-[19px]">
            {isDesktopWindowMode ? 'fullscreen' : 'fullscreen_exit'}
          </span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onToggleNotifications}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors relative cursor-pointer ${
            notificationsOpen ? 'bg-[#151618] text-white shadow-sm' : 'text-[#46464a] hover:bg-black/5'
          }`}
          title="Notifications"
          aria-label="Toggle notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4E9F6B] ring-2 ring-white"></span>
          )}
        </button>

        {/* Sync Active Pill */}
        <div
          onClick={() => onSelectTab('integrations')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8e8e6] text-[#46464a] text-xs font-outfit font-medium cursor-pointer hover:bg-[#dadad8] transition-colors"
          title="View Integrations Hub"
        >
          <span className="w-2 h-2 rounded-full bg-[#4E9F6B] animate-pulse"></span>
          <span className="hidden sm:inline">Sync Active</span>
        </div>

        {/* User Profile & Auth Trigger */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 pl-1 cursor-pointer group"
          title="Supabase Auth & Profile"
        >
          <span className="text-sm font-outfit font-medium text-[#1a1c1b] hidden lg:inline group-hover:text-black">
            {profile?.display_name || (user ? user.email?.split('@')[0] : 'Gowrish')}
          </span>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#151618] text-white flex items-center justify-center font-outfit font-bold text-xs ring-2 ring-[#e8e8e6] group-hover:ring-[#C9D8E6] transition-all">
              {(profile?.display_name || user?.email || 'G')[0].toUpperCase()}
            </div>
            <span className={`w-2.5 h-2.5 rounded-full absolute bottom-0 right-0 ring-1 ring-white ${
              user ? 'bg-[#4E9F6B]' : 'bg-[#e2a03f]'
            }`} title={user ? 'Authenticated via Supabase' : 'Guest / Demo Mode'}></span>
          </div>
        </button>
      </div>
    </header>
  );
};
