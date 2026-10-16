import React, { useState } from 'react';
import { NavTabId } from '../../types';

interface AnalyticsViewProps {
  onSelectTab: (tab: NavTabId) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onSelectTab }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'Semester'>('7d');

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#151618] tracking-tight font-outfit">Performance & Analytics</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d9e6e8] text-[#2c4046]">
              Deep Work Engine
            </span>
          </div>
          <p className="text-[#57595b] text-sm mt-1">
            Execution velocity, cognitive time distribution, academic grade forecasting, and habit resilience.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl">
          {(['7d', '30d', 'Semester'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                timeRange === range ? 'bg-[#151618] text-white shadow-sm' : 'text-[#57595b] hover:text-black'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Full Semester'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Deep Work Logged</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe5d2] flex items-center justify-center text-[#1e4d23]">
              <span className="material-symbols-outlined text-base">timer</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">38.5 hrs</div>
            <div className="text-xs text-[#3d8357] font-semibold mt-1">
              +6.2 hrs vs prior week (Goal: 35h)
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Task Completion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-[#f7d774] flex items-center justify-center text-[#694400]">
              <span className="material-symbols-outlined text-base">task_alt</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">92.8%</div>
            <div className="text-xs text-[#694400] font-semibold mt-1">
              39 / 42 tasks delivered on schedule
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">CGPA Trajectory</span>
            <div className="w-8 h-8 rounded-lg bg-[#e3d3e8] flex items-center justify-center text-[#552763]">
              <span className="material-symbols-outlined text-base">insights</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">8.92 → 9.15</div>
            <div className="text-xs text-[#552763] font-semibold mt-1">
              Projected if CAT-1 scores &gt; 42/50
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Habit Consistency</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe5d2] flex items-center justify-center text-[#1e4d23]">
              <span className="material-symbols-outlined text-base">psychology</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">89%</div>
            <div className="text-xs text-[#3d8357] font-semibold mt-1">
              Best category: Physical Fitness & Reading
            </div>
          </div>
        </div>
      </div>

      {/* Time Allocation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#151618]">Cognitive Domain Distribution (Hours/Week)</h2>
          <p className="text-xs text-[#77777b]">Visual audit of where mental energy and focus hours were spent</p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Academics & Semester 5 Prep</span>
                <span>16.5 hrs (43%)</span>
              </div>
              <div className="w-full bg-black/5 rounded-full h-3">
                <div className="bg-[#151618] h-3 rounded-full" style={{ width: '43%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Career, DSA & System Design</span>
                <span>11.0 hrs (28%)</span>
              </div>
              <div className="w-full bg-black/5 rounded-full h-3">
                <div className="bg-[#3d8357] h-3 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Toastmasters VPPR & Public Speaking</span>
                <span>6.0 hrs (16%)</span>
              </div>
              <div className="w-full bg-black/5 rounded-full h-3">
                <div className="bg-[#bfa01e] h-3 rounded-full" style={{ width: '16%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Creative Studio (Blender / DaVinci)</span>
                <span>5.0 hrs (13%)</span>
              </div>
              <div className="w-full bg-black/5 rounded-full h-3">
                <div className="bg-[#7a5b87] h-3 rounded-full" style={{ width: '13%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Velocity Chart */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#151618]">Daily Output Velocity (Mon - Sun)</h2>
          <p className="text-xs text-[#77777b]">Focus sessions logged vs task points completed</p>

          <div className="flex items-end justify-between h-44 pt-6 px-2 border-b border-black/10">
            {[
              { day: 'Mon', hours: 5.2, height: '65%' },
              { day: 'Tue', hours: 6.8, height: '85%' },
              { day: 'Wed', hours: 7.4, height: '95%' },
              { day: 'Thu', hours: 6.1, height: '76%' },
              { day: 'Fri', hours: 7.0, height: '88%' },
              { day: 'Sat', hours: 4.0, height: '50%' },
              { day: 'Sun', hours: 2.0, height: '25%' },
            ].map(col => (
              <div key={col.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-[#57595b] opacity-0 group-hover:opacity-100 transition">
                  {col.hours}h
                </span>
                <div
                  className="w-10 rounded-t-lg bg-[#151618] hover:bg-neutral-800 transition-all duration-300"
                  style={{ height: col.height }}
                ></div>
                <span className="text-xs font-bold text-[#77777b]">{col.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#57595b]">
            <span>Peak Productivity Day: Wednesday (7.4h)</span>
            <span className="font-bold text-emerald-700">Optimal Energy Zone: 9 AM - 1 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
