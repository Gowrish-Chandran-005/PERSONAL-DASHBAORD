import React from 'react';
import { NavTabId } from '../types';

interface SidebarProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onOpenQuickAdd: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onOpenQuickAdd }) => {
  const navItemsTop: { id: NavTabId; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'my-day', label: 'My Day', icon: 'wb_sunny' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_today' },
    { id: 'tasks-and-projects', label: 'Tasks & Projects', icon: 'check_circle' },
  ];

  const navItemsMiddle: { id: NavTabId; label: string; icon: string }[] = [
    { id: 'academics', label: 'Academics', icon: 'school' },
    { id: 'toastmasters', label: 'Toastmasters', icon: 'record_voice_over' },
    { id: 'career-and-learning', label: 'Career & Learning', icon: 'trending_up' },
    { id: 'creative-studio', label: 'Creative Studio', icon: 'palette' },
  ];

  const navItemsAnalytics: { id: NavTabId; label: string; icon: string }[] = [
    { id: 'habits-and-wellness', label: 'Habits & Wellness', icon: 'spa' },
    { id: 'analytics', label: 'Analytics', icon: 'monitoring' },
  ];

  const navItemsSystem: { id: NavTabId; label: string; icon: string }[] = [
    { id: 'integrations', label: 'Integrations', icon: 'hub' },
    { id: 'settings', label: 'Settings', icon: 'tune' },
  ];

  const renderNavButton = (item: { id: NavTabId; label: string; icon: string }) => {
    const isActive = currentTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onSelectTab(item.id)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all group relative cursor-pointer ${
          isActive
            ? 'bg-white text-[#151618] shadow-md scale-105'
            : 'text-[#929193] hover:bg-white/10 hover:text-white'
        }`}
        title={item.label}
        aria-label={item.label}
      >
        <span className="material-symbols-outlined text-[24px] select-none">{item.icon}</span>
        {/* Tooltip on hover */}
        <span className="absolute left-[68px] z-50 px-2.5 py-1 bg-[#151618] text-white text-[11px] font-sora font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <aside className="w-[100px] lg:w-[110px] bg-[#2a2a2c] shrink-0 flex flex-col items-center py-6 z-20 select-none">
      {/* Brand Monogram Avatar Logo */}
      <button
        onClick={() => onSelectTab('overview')}
        className="w-14 h-14 rounded-full flex items-center justify-center mb-6 overflow-hidden bg-white/10 hover:bg-white/15 transition-all cursor-pointer group"
        title="GOWRISH OS - Life Command"
      >
        <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#151618] font-outfit font-bold text-lg shadow-inner group-hover:scale-105 transition-transform">
          G
        </div>
      </button>

      {/* Nav groups */}
      <nav className="flex-1 w-full flex flex-col items-center gap-[24px] overflow-y-auto no-scrollbar py-1">
        <div className="flex flex-col items-center gap-[22px]">
          {navItemsTop.map(renderNavButton)}
        </div>

        <div className="w-8 h-[1px] bg-white/15 shrink-0" />

        <div className="flex flex-col items-center gap-[22px]">
          {navItemsMiddle.map(renderNavButton)}
        </div>

        <div className="w-8 h-[1px] bg-white/15 shrink-0" />

        <div className="flex flex-col items-center gap-[22px]">
          {navItemsAnalytics.map(renderNavButton)}
        </div>

        <div className="w-8 h-[1px] bg-white/15 shrink-0" />

        <div className="flex flex-col items-center gap-[22px]">
          {navItemsSystem.map(renderNavButton)}
        </div>
      </nav>

      {/* Bottom Actions: Quick Add trigger & Power / Logout */}
      <div className="pt-4 flex flex-col items-center gap-3">
        <button
          onClick={onOpenQuickAdd}
          className="w-11 h-11 rounded-full bg-[#F7D774] text-[#151618] hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-sm cursor-pointer"
          title="Quick Add (Cmd/Ctrl + K)"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
        </button>

        <button
          onClick={() => onSelectTab('settings')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#929193] hover:text-[#ba1a1a] hover:bg-white/10 transition-colors cursor-pointer"
          title="Power / System Control"
        >
          <span className="material-symbols-outlined text-[20px]">power_settings_new</span>
        </button>
      </div>
    </aside>
  );
};
