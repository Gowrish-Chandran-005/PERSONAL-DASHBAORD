import React, { useState } from 'react';
import { IntegrationService, NavTabId } from '../../types';
import { INITIAL_INTEGRATIONS } from '../../data/mockData';

interface IntegrationsViewProps {
  onSelectTab: (tab: NavTabId) => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ onSelectTab }) => {
  const [integrations, setIntegrations] = useState<IntegrationService[]>(INITIAL_INTEGRATIONS);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');

  const handleSyncService = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setIntegrations(prev =>
        prev.map(item => {
          if (item.id !== id) return item;
          return {
            ...item,
            lastSuccess: 'Just now',
            lastAttempt: 'Just now',
            status: item.id === 'int-2' ? 'Connected' : item.status,
            warningNote: item.id === 'int-2' ? undefined : item.warningNote,
          };
        })
      );
      setSyncingId(null);
    }, 1200);
  };

  const handleSolveCaptcha = () => {
    setShowCaptchaModal(false);
    handleSyncService('int-2');
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#151618] tracking-tight font-outfit">Integrations & Pipelines</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d9e6e8] text-[#2c4046]">
              Sync Engine 2.4
            </span>
          </div>
          <p className="text-[#57595b] text-sm mt-1">
            Automated crawlers for VTOP university portal, Google Workspace two-way synchronization, and data backups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSyncService('all')}
            disabled={!!syncingId}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold shadow-md transition"
          >
            <span className={`material-symbols-outlined text-sm ${syncingId ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{syncingId ? 'Syncing Ecosystem...' : 'Sync All Integrations'}</span>
          </button>
        </div>
      </div>

      {/* Integration Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map(srv => (
          <div
            key={srv.id}
            className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-[#151618]">
                    <span className="material-symbols-outlined text-xl">{srv.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#151618]">{srv.name}</h3>
                    <p className="text-xs text-[#77777b]">{srv.description}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    srv.status === 'Connected'
                      ? 'bg-[#cfe5d2] text-[#1e4d23]'
                      : srv.status === 'Needs Attention'
                      ? 'bg-[#fff8eb] text-[#694400] border border-amber-300'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {srv.status}
                </span>
              </div>

              {srv.warningNote && (
                <div className="p-3 rounded-xl bg-[#fff8eb] border border-amber-200 text-xs text-[#855400] flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm text-[#bfa01e] shrink-0 mt-0.5">warning</span>
                  <div>
                    <span className="font-bold">Session Warning:</span> {srv.warningNote}
                  </div>
                </div>
              )}

              <div className="space-y-1 text-xs text-[#57595b]">
                <div className="flex justify-between">
                  <span>Frequency:</span>
                  <span className="font-semibold text-[#151618]">{srv.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Success:</span>
                  <span className="font-semibold text-[#151618]">{srv.lastSuccess}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Attempt:</span>
                  <span className="font-semibold text-[#151618]">{srv.lastAttempt}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-black/5">
                <div className="text-[10px] uppercase font-bold text-[#77777b] mb-1.5">Synced Data Entities:</div>
                <div className="flex flex-wrap gap-1">
                  {srv.dataSynced.map(d => (
                    <span key={d} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f5f6f8] text-[#57595b]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-black/5 flex items-center gap-2">
              {srv.id === 'int-2' && srv.status === 'Needs Attention' ? (
                <button
                  onClick={() => setShowCaptchaModal(true)}
                  className="flex-1 py-2 rounded-xl bg-[#694400] hover:bg-[#523500] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <span className="material-symbols-outlined text-sm">vpn_key</span>
                  Resolve Captcha Session
                </button>
              ) : srv.status === 'Disconnected' ? (
                <button
                  onClick={() => handleSyncService(srv.id)}
                  className="flex-1 py-2 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <span className="material-symbols-outlined text-sm">link</span>
                  Connect Google Account
                </button>
              ) : (
                <button
                  onClick={() => handleSyncService(srv.id)}
                  disabled={syncingId === srv.id}
                  className="flex-1 py-2 rounded-xl bg-white hover:bg-neutral-50 border border-black/10 text-xs font-bold text-[#151618] transition flex items-center justify-center gap-1.5"
                >
                  <span className={`material-symbols-outlined text-sm ${syncingId === srv.id ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  {syncingId === srv.id ? 'Syncing...' : 'Poll Now'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sync Activity Logs */}
      <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-[#151618]">Recent Crawler & Dispatch Logs</h3>

        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-[#f5f6f8] border border-black/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-[#151618]">Google Sheets Roster Sync</span>
              <span className="text-[#77777b]">Updated 7 attendee roles for Session #42</span>
            </div>
            <span className="text-[#77777b]">12:42 PM • Status 200 OK</span>
          </div>

          <div className="p-3 rounded-xl bg-[#fff8eb] border border-amber-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="font-bold text-[#694400]">VTOP Attendance Poller</span>
              <span className="text-[#855400]">HTTP 401 Session Timeout (CSRF refresh required)</span>
            </div>
            <span className="text-[#855400]">12:38 PM • Warning</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f5f6f8] border border-black/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-[#151618]">Gmail Daily Digest Dispatcher</span>
              <span className="text-[#77777b]">Delivered briefing to gowrishananthi@gmail.com</span>
            </div>
            <span className="text-[#77777b]">08:00 AM • Status 200 OK</span>
          </div>
        </div>
      </div>

      {/* Captcha Modal */}
      {showCaptchaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowCaptchaModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#151618]">VTOP Session Re-authentication</h3>
              <button
                onClick={() => setShowCaptchaModal(false)}
                className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#57595b] leading-relaxed">
              VIT's VTOP student portal mandates session token renewal every 12 hours. Enter the generated image code below to renew automated attendance polling.
            </p>

            <div className="p-4 rounded-xl bg-neutral-900 flex items-center justify-center">
              <div className="font-mono text-2xl font-black tracking-widest text-emerald-400 select-all">
                7 K B 9 Q
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#57595b] block mb-1">Enter Verification Code</label>
              <input
                type="text"
                value={captchaInput}
                onChange={e => setCaptchaInput(e.target.value.toUpperCase())}
                placeholder="Type 7KB9Q"
                className="w-full px-3 py-2 rounded-xl border border-black/10 text-sm font-mono font-bold bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCaptchaModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#57595b] hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSolveCaptcha}
                className="px-5 py-2 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold transition shadow"
              >
                Authenticate & Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
