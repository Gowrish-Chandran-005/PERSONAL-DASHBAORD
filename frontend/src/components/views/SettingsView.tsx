import React, { useState } from 'react';
import { NavTabId } from '../../types';

interface SettingsViewProps {
  onSelectTab: (tab: NavTabId) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSelectTab }) => {
  const [attendanceThreshold, setAttendanceThreshold] = useState('75.0');
  const [safeTarget, setSafeTarget] = useState('80.0');
  const [emailDigest, setEmailDigest] = useState(true);
  const [eveningReminder, setEveningReminder] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      user: "Gowrish",
      email: "gowrishananthi@gmail.com",
      timestamp: new Date().toISOString(),
      system: "GOWRISH OS v2.4"
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gowrish_os_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#151618] tracking-tight font-outfit">System Settings</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d9e6e8] text-[#2c4046]">
              Preferences
            </span>
          </div>
          <p className="text-[#57595b] text-sm mt-1">
            Configure threshold rules, notification triggers, VTOP sync parameters, and personal profile metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              Settings updated successfully!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold shadow-md transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#2a2a2c] text-white flex items-center justify-center font-black text-2xl font-outfit shadow-md">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#151618]">Gowrish</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#cfe5d2] text-[#1e4d23]">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-[#57595b]">gowrishananthi@gmail.com</p>
            <p className="text-xs text-[#77777b] mt-1">
              B.Tech Computer Science & Engineering • Fall 2026 Semester 5
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-black/10 text-xs font-bold text-[#151618] hover:bg-gray-50 transition"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export JSON Backup
          </button>
        </div>
      </div>

      {/* Academic Safeguards & Thresholds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#151618]">Academic Safeguards & VTOP Norms</h3>
          <p className="text-xs text-[#77777b]">
            Thresholds for debarment prevention and grade point tracking.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-[#57595b] block mb-1">
                Mandatory Attendance Floor (%)
              </label>
              <input
                type="text"
                value={attendanceThreshold}
                onChange={e => setAttendanceThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-black/10 text-sm font-bold bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-black/20"
              />
              <span className="text-[11px] text-[#77777b] mt-1 block">
                Standard university threshold is 75.0%. Below this triggers urgent alarms.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#57595b] block mb-1">
                Comfort Safety Target (%)
              </label>
              <input
                type="text"
                value={safeTarget}
                onChange={e => setSafeTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-black/10 text-sm font-bold bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-black/20"
              />
              <span className="text-[11px] text-[#77777b] mt-1 block">
                Calculates how many classes can be safely skipped while staying at or above this percentage.
              </span>
            </div>
          </div>
        </div>

        {/* Notifications & Dispatch Rules */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#151618]">Notification Engine & Alerts</h3>
          <p className="text-xs text-[#77777b]">
            Control dispatch triggers across email, desktop notifications, and mobile web badges.
          </p>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#f5f6f8] border border-black/5 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-[#151618]">Daily 8:00 AM Morning Briefing</div>
                <div className="text-[11px] text-[#77777b]">Delivers calendar schedule and priority tasks to Gmail</div>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={e => setEmailDigest(e.target.checked)}
                className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#f5f6f8] border border-black/5 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-[#151618]">Evening 9:30 PM Reflection Prompt</div>
                <div className="text-[11px] text-[#77777b]">Nudges habit logging and daily review before sleep</div>
              </div>
              <input
                type="checkbox"
                checked={eveningReminder}
                onChange={e => setEveningReminder(e.target.checked)}
                className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#f5f6f8] border border-black/5 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-[#151618]">Micro-interaction Audio Cues</div>
                <div className="text-[11px] text-[#77777b]">Subtle click and celebration chimes on task completion</div>
              </div>
              <input
                type="checkbox"
                checked={soundFeedback}
                onChange={e => setSoundFeedback(e.target.checked)}
                className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
