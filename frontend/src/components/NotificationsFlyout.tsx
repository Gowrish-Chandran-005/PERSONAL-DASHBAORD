import React, { useState } from 'react';
import { NotificationItem, NavTabId } from '../types';

interface NotificationsFlyoutProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelectTab: (tab: NavTabId) => void;
  onRetryNotification: (id: string) => void;
}

export const NotificationsFlyout: React.FC<NotificationsFlyoutProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
  onSelectTab,
  onRetryNotification,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'academics' | 'deadlines' | 'system'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'academics') return item.category === 'Academics';
    if (activeFilter === 'deadlines') return item.category === 'Deadlines';
    if (activeFilter === 'system') return item.category === 'System';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Click outside backdrop */}
      <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]" onClick={onClose} />

      {/* Flyout card */}
      <div className="absolute top-16 right-4 lg:right-8 z-50 w-full max-w-[420px] bg-white rounded-[24px] shadow-2xl border border-black/5 p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Block */}
        <div className="flex items-center justify-between pb-1 border-b border-black/5">
          <div className="flex items-center gap-2">
            <h3 className="font-outfit font-semibold text-base text-[#151618]">Notifications</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#d5e4f3] text-[#0f1d27] text-[10px] font-sora font-semibold">
              {unreadCount} new
            </span>
          </div>
          <button
            onClick={onMarkAllRead}
            className="text-xs font-sora text-[#52606c] hover:text-[#151618] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Mark all read</span>
            <span className="material-symbols-outlined text-[15px]">done_all</span>
          </button>
        </div>

        {/* Filter Tabs Pill Group */}
        <div className="flex items-center gap-1 p-1 bg-[#f4f4f2] rounded-full">
          {(['all', 'academics', 'deadlines', 'system'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`flex-1 py-1 rounded-full text-xs font-sora font-medium capitalize transition-all cursor-pointer ${
                activeFilter === tab
                  ? 'bg-[#151618] text-white shadow-sm'
                  : 'text-[#52606c] hover:text-[#151618]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification Feed (Scrollable) */}
        <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-8 text-center text-xs font-outfit text-[#77777b]">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`group rounded-2xl p-3.5 flex flex-col gap-2 transition-all cursor-pointer ${
                  item.read
                    ? 'bg-[#f9f9f7] opacity-75 hover:opacity-100'
                    : 'bg-[#f4f4f2] hover:bg-[#e8e8e6] shadow-sm'
                }`}
                onClick={() => {
                  if (item.category === 'Academics') onSelectTab('academics');
                  else if (item.category === 'Deadlines') onSelectTab('toastmasters');
                  else if (item.category === 'Habits') onSelectTab('habits-and-wellness');
                  else onSelectTab('integrations');
                  onClose();
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e4e2e4] text-[#1b1b1d] text-[10px] font-sora font-semibold">
                    {item.tag}
                  </span>
                  <span className="text-[11px] font-outfit text-[#77777b]">{item.time}</span>
                </div>

                <p className="font-outfit text-xs text-[#1a1c1b] leading-relaxed font-medium">
                  {item.title}
                </p>

                <div className="flex items-center justify-between pt-1">
                  {item.deliveryStatus.includes('failed') ? (
                    <div className="flex items-center gap-1.5 text-xs text-[#ba1a1a]">
                      <span className="material-symbols-outlined text-[15px]">error</span>
                      <span>Email failed –</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRetryNotification(item.id);
                        }}
                        className="underline font-bold hover:text-black cursor-pointer"
                      >
                        retry
                      </button>
                    </div>
                  ) : item.deliveryStatus.includes('delivered') ? (
                    <div className="flex items-center gap-1.5 text-xs text-[#4E9F6B]">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                      <span>Email delivered</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-[#77777b]">
                      <span className="material-symbols-outlined text-[15px]">devices</span>
                      <span>In-app only</span>
                    </div>
                  )}

                  <span className="material-symbols-outlined text-[16px] text-[#77777b] opacity-0 group-hover:opacity-100 transition-opacity">
                    chevron_right
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-black/5 flex items-center justify-between">
          <button
            onClick={onMarkAllRead}
            className="px-3 py-1 rounded-full bg-[#f4f4f2] hover:bg-[#e8e8e6] text-xs font-sora text-[#1a1c1b] transition-colors cursor-pointer"
          >
            Mark all read
          </button>
          <button
            onClick={() => {
              onSelectTab('settings');
              onClose();
            }}
            className="flex items-center gap-1 text-xs font-sora text-[#52606c] hover:text-[#151618] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Notification Settings</span>
          </button>
        </div>
      </div>
    </>
  );
};
