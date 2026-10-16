import React, { useState } from 'react';
import { HabitItem, NavTabId } from '../../types';
import { INITIAL_HABITS } from '../../data/mockData';
import confetti from 'canvas-confetti';

interface HabitsViewProps {
  onOpenQuickAdd: () => void;
  onSelectTab: (tab: NavTabId) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({ onOpenQuickAdd, onSelectTab }) => {
  const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);
  const [waterCups, setWaterCups] = useState(6); // 6 x 500ml = 3.0L
  const [energyLevel, setEnergyLevel] = useState(8);
  const [reflectionNote, setReflectionNote] = useState('Clear mental focus today. CAT-1 prep is progressing steadily.');
  const [savedNote, setSavedNote] = useState(false);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== habitId) return h;
        const newHistory = [...h.history];
        newHistory[dayIndex] = !newHistory[dayIndex];
        const completedDays = newHistory.filter(Boolean).length;
        const newRate = Math.round((completedDays / 7) * 100);
        return {
          ...h,
          history: newHistory,
          completionRate: newRate,
        };
      })
    );

    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#cfe5d2', '#3d8357', '#151618'],
    });
  };

  const handleSaveNote = () => {
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#151618] tracking-tight font-outfit">Habits & Wellness</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#cfe5d2] text-[#1e4d23]">
              21 Day Peak Streak
            </span>
          </div>
          <p className="text-[#57595b] text-sm mt-1">
            Atomic discipline tracking across physical fitness, cognitive clarity, public speaking drills, and sleep hygiene.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setWaterCups(c => Math.min(8, c + 1))}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-[#151618] shadow-sm transition border border-white/40"
          >
            <span className="material-symbols-outlined text-sm text-blue-500">water_drop</span>
            <span>+500ml Water ({waterCups * 0.5}L)</span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold shadow-md transition"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New Daily Habit</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Weekly Adherence</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe5d2] flex items-center justify-center text-[#1e4d23]">
              <span className="material-symbols-outlined text-base">verified</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">89.4%</div>
            <div className="text-xs text-[#3d8357] font-semibold mt-1">
              +4.2% higher than last week
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Longest Streak</span>
            <div className="w-8 h-8 rounded-lg bg-[#e3d3e8] flex items-center justify-center text-[#552763]">
              <span className="material-symbols-outlined text-base">local_fire_department</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">21 Days</div>
            <div className="text-xs text-[#552763] font-semibold mt-1">
              Evening Journaling & Reflection
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Rest & Recovery</span>
            <div className="w-8 h-8 rounded-lg bg-[#d9e6e8] flex items-center justify-center text-[#2c4046]">
              <span className="material-symbols-outlined text-base">bedtime</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">7.8 hrs</div>
            <div className="text-xs text-[#2c4046] font-semibold mt-1">
              92% Sleep Efficiency Score
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Hydration</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <span className="material-symbols-outlined text-base">water_drop</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">{waterCups * 0.5}L <span className="text-sm font-normal text-[#77777b]">/ 3.5L</span></div>
            <div className="text-xs text-blue-700 font-semibold mt-1">
              {waterCups >= 7 ? 'Goal almost met' : `${7 - waterCups} more glasses to optimal`}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Matrix Grid */}
      <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5">
          <div>
            <h2 className="text-lg font-bold text-[#151618]">Weekly Habit Matrix (12 Oct – 18 Oct 2026)</h2>
            <p className="text-xs text-[#77777b]">Click any day circle to toggle completion status</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#57595b] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#151618]"></span> Completed
            </span>
            <span className="text-xs font-semibold text-[#57595b] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200"></span> Incomplete
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 text-[#77777b] uppercase font-bold text-[10px] tracking-wider">
                <th className="pb-3 px-3">Habit Name</th>
                <th className="pb-3 px-3 text-center">Streak</th>
                {daysOfWeek.map((day, idx) => (
                  <th key={day} className={`pb-3 px-2 text-center ${idx === 4 ? 'text-[#151618] font-black' : ''}`}>
                    {day} {idx === 4 && '(Today)'}
                  </th>
                ))}
                <th className="pb-3 px-3 text-right">Weekly Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {habits.map(h => (
                <tr key={h.id} className="hover:bg-[#f5f6f8] transition">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-[#151618]">
                        <span className="material-symbols-outlined text-base">{h.icon}</span>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#151618]">{h.name}</div>
                        <div className="text-[10px] text-[#77777b]">Daily Target</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs bg-amber-50 text-amber-800 border border-amber-200/60">
                      <span className="material-symbols-outlined text-xs">local_fire_department</span>
                      {h.streak}d
                    </span>
                  </td>

                  {h.history.map((done, dayIdx) => (
                    <td key={dayIdx} className="py-3.5 px-2 text-center">
                      <button
                        onClick={() => toggleHabitDay(h.id, dayIdx)}
                        className={`w-7 h-7 rounded-full inline-flex items-center justify-center transition-all ${
                          done
                            ? 'bg-[#151618] text-white shadow hover:scale-110'
                            : 'bg-neutral-200 hover:bg-neutral-300 text-transparent'
                        }`}
                        title={`Toggle ${daysOfWeek[dayIdx]}`}
                      >
                        <span className="material-symbols-outlined text-sm">check</span>
                      </button>
                    </td>
                  ))}

                  <td className="py-3.5 px-3 text-right">
                    <span className="font-black text-xs text-[#151618]">{h.completionRate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wellness & Daily Reflection logger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#151618]">Energy & Focus Check-in</h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
              Level {energyLevel} / 10
            </span>
          </div>

          <p className="text-xs text-[#77777b]">
            Calibrate cognitive stamina to align with deep work timeblocks.
          </p>

          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={e => setEnergyLevel(Number(e.target.value))}
            className="w-full accent-[#151618] cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-[#77777b] font-medium">
            <span>1 - Exhausted</span>
            <span>5 - Balanced</span>
            <span>10 - Hyperfocused & Flow</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f5f6f8] border border-black/5 text-xs text-[#57595b] leading-relaxed">
            Recommendation for Level {energyLevel}: You have high cognitive bandwidth. Prioritize difficult LeetCode DP problems and CAT-1 software architecture modules before 3:00 PM.
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#151618]">Evening Reflection</h3>
              <span className="text-xs text-[#77777b]">Streak: Day 21</span>
            </div>

            <textarea
              value={reflectionNote}
              onChange={e => setReflectionNote(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-black/10 text-xs font-medium bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="What went exceptionally well today? What will you tweak tomorrow?"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-emerald-700 font-semibold">
              {savedNote ? 'Saved to personal journal' : 'Auto-saves locally'}
            </span>
            <button
              onClick={handleSaveNote}
              className="px-4 py-2 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold transition shadow"
            >
              Log Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
