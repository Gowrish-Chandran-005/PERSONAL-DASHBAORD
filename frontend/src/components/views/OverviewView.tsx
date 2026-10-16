import React, { useState, useEffect } from 'react';
import { TaskItem, NavTabId } from '../../types';

interface OverviewViewProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onSelectTab: (tab: NavTabId) => void;
  onOpenQuickAdd: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  tasks,
  onToggleTask,
  onSelectTab,
  onOpenQuickAdd,
}) => {
  // Focus Timer local state
  const [timerSeconds, setTimerSeconds] = useState(752); // 12:32
  const [timerRunning, setTimerRunning] = useState(false);
  const [retryState, setRetryState] = useState<'idle' | 'retrying' | 'success'>('idle');

  useEffect(() => {
    let interval: any;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetrySync = () => {
    setRetryState('retrying');
    setTimeout(() => {
      setRetryState('success');
      setTimeout(() => setRetryState('idle'), 3000);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col xl:flex-row gap-5 w-full items-start">
        {/* 1. MAIN CONTENT AREA */}
        <section className="flex-1 min-w-0 bg-[#f4f4f2] rounded-3xl p-6 lg:p-7 flex flex-col shadow-sm">
          {/* TOP HEADER ROW */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-outfit text-2xl lg:text-3xl font-semibold text-[#151618] tracking-tight">
                Hi, Gowrish
              </h1>
              <p className="font-outfit text-sm text-[#46464a] mt-0.5">
                Friday, 16 October • 3 priorities today • SOL session in 2 days
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
              <div className="flex items-center gap-2">
                {/* Search Pill */}
                <div className="h-[48px] px-4 rounded-full bg-white shadow-sm flex items-center gap-2.5 w-56 sm:w-64">
                  <span className="material-symbols-outlined text-[#77777b] text-[18px]">search</span>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-0 outline-none font-outfit text-xs text-[#151618] placeholder:text-[#77777b] w-full p-0"
                  />
                </div>
                {/* Quick Add Pill */}
                <button
                  onClick={onOpenQuickAdd}
                  className="w-[48px] h-[48px] rounded-full bg-white shadow-sm flex items-center justify-center text-[#151618] hover:bg-[#e8e8e6] transition-colors cursor-pointer"
                  title="Quick Add"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
              <span className="font-sora text-[10px] text-[#77777b] pr-1">
                Last synced 4 min ago • Sample data
              </span>
            </div>
          </div>

          {/* ROW 1: THREE PASTEL STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {/* Lilac Card */}
            <div className="bg-[#E3D3E8] rounded-[20px] p-5 h-[104px] flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="flex flex-col justify-between h-full">
                <span className="font-outfit text-xs font-semibold text-[#151618]/80">Today's Tasks</span>
                <span className="font-outfit text-3xl font-bold text-[#151618] leading-none">5 / 8</span>
              </div>
              <button
                onClick={() => onSelectTab('my-day')}
                className="rounded-full bg-white px-5 py-2 font-sora text-xs font-semibold text-[#151618] shadow-sm hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
              >
                Check
              </button>
            </div>

            {/* Powder-Blue Card */}
            <div className="bg-[#C9D8E6] rounded-[20px] p-5 h-[104px] flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="flex flex-col justify-between h-full">
                <span className="font-outfit text-xs font-semibold text-[#151618]/80">Lowest Attendance</span>
                <span className="font-outfit text-3xl font-bold text-[#151618] leading-none">78%</span>
              </div>
              <button
                onClick={() => onSelectTab('academics')}
                className="rounded-full bg-white px-5 py-2 font-sora text-xs font-semibold text-[#151618] shadow-sm hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
              >
                Check
              </button>
            </div>

            {/* Warm Yellow Card */}
            <div className="bg-[#F7D774] rounded-[20px] p-5 h-[104px] flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="flex flex-col justify-between h-full">
                <span className="font-outfit text-xs font-semibold text-[#151618]/80">Active Applications</span>
                <span className="font-outfit text-3xl font-bold text-[#151618] leading-none">12</span>
              </div>
              <button
                onClick={() => onSelectTab('career-and-learning')}
                className="rounded-full bg-white px-5 py-2 font-sora text-xs font-semibold text-[#151618] shadow-sm hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
              >
                Check
              </button>
            </div>
          </div>

          {/* ROW 2: WEEKLY OVERVIEW CARD */}
          <div className="bg-white rounded-3xl p-6 shadow-sm mt-5 flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-outfit text-xl font-semibold text-[#151618] tracking-tight">
                Weekly Overview
              </h2>
              <div className="rounded-full bg-[#eeeeec] px-3.5 py-1.5 flex items-center gap-2.5 font-sora text-[11px] text-[#151618]">
                <div className="flex items-center gap-1 text-[#46464a]">
                  <span className="material-symbols-outlined text-[15px]">tune</span>
                  <span>Filter</span>
                </div>
                <span className="text-[#c7c6ca]">•</span>
                <span className="cursor-pointer font-medium hover:text-black">Week ▾</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[#151618] font-medium shadow-xs">
                  x 4 areas
                </span>
              </div>
            </div>

            {/* Metric comparison subheader */}
            <div className="mt-3 flex items-center justify-between font-outfit text-xs text-[#46464a]">
              <span>Last week: 18 tasks done</span>
              <div className="flex items-center gap-2 flex-1 max-w-[200px] px-3">
                <div className="h-[1px] bg-[#c7c6ca]/50 flex-1"></div>
                <span className="text-[#4E9F6B] bg-[#CFE5D2]/60 px-3 py-0.5 rounded-full font-sora text-[11px] font-bold">
                  +6
                </span>
                <div className="h-[1px] bg-[#c7c6ca]/50 flex-1"></div>
              </div>
              <span className="text-[#151618] font-semibold">This week: 24 tasks done</span>
            </div>

            {/* Chart Visual: Flow Sankey & Scatter Clusters */}
            <div className="mt-4 w-full overflow-x-auto">
              <div className="min-w-[620px] h-[190px] relative flex items-center justify-between px-1">
                {/* Left Nodes */}
                <div className="flex flex-col justify-between h-full py-1 z-10 shrink-0">
                  <div className="px-3 py-1 rounded-full bg-[#E3D3E8] font-sora text-[10px] text-[#151618] flex items-center gap-1.5 shadow-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#151618]/30"></span>
                    <span>Academics 14h</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#C9D8E6] font-sora text-[10px] text-[#151618] flex items-center gap-1.5 shadow-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#151618]/30"></span>
                    <span>Toastmasters 6h</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#F7D774] font-sora text-[10px] text-[#151618] flex items-center gap-1.5 shadow-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#151618]/30"></span>
                    <span>Career Prep 11h</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#F4C9A8] font-sora text-[10px] text-[#151618] flex items-center gap-1.5 shadow-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#151618]/30"></span>
                    <span>Creative 5h</span>
                  </div>
                </div>

                {/* Flow Ribbons SVG */}
                <div className="flex-1 h-full mx-3 relative">
                  <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 340 190">
                    {/* Academic flows (Lilac) */}
                    <path d="M 0,16 C 100,16 180,24 340,24 L 340,38 C 180,38 100,24 0,24 Z" fill="#E3D3E8" fillOpacity="0.65" />
                    <path d="M 0,20 C 120,20 180,72 340,72 L 340,82 C 180,82 120,26 0,26 Z" fill="#E3D3E8" fillOpacity="0.5" />
                    {/* Toastmasters flows (Blue) */}
                    <path d="M 0,68 C 120,68 180,30 340,30 L 340,40 C 180,40 120,74 0,74 Z" fill="#C9D8E6" fillOpacity="0.65" />
                    <path d="M 0,72 C 110,72 170,120 340,120 L 340,130 C 170,130 110,78 0,78 Z" fill="#C9D8E6" fillOpacity="0.5" />
                    {/* Career Prep flows (Yellow) */}
                    <path d="M 0,122 C 100,122 170,76 340,76 L 340,88 C 170,88 100,130 0,130 Z" fill="#F7D774" fillOpacity="0.65" />
                    <path d="M 0,126 C 130,126 190,168 340,168 L 340,178 C 190,178 130,132 0,132 Z" fill="#F7D774" fillOpacity="0.5" />
                    {/* Creative flows (Peach) */}
                    <path d="M 0,170 C 120,170 180,124 340,124 L 340,134 C 180,134 120,176 0,176 Z" fill="#F4C9A8" fillOpacity="0.65" />
                    <path d="M 0,174 C 140,174 190,172 340,172 L 340,182 C 190,182 140,180 0,180 Z" fill="#F4C9A8" fillOpacity="0.5" />
                  </svg>
                </div>

                {/* Middle Output Labels */}
                <div className="flex flex-col justify-between h-full py-1 z-10 shrink-0 text-right pr-4 font-sora text-[11px] text-[#151618]">
                  <span>Tasks completed <strong className="font-bold">24</strong></span>
                  <span>Focus sessions <strong className="font-bold">19</strong></span>
                  <span>Habits logged <strong className="font-bold">41</strong></span>
                  <span>Deadlines met <strong className="font-bold">7</strong></span>
                </div>

                {/* Far right daily scatter bubble clusters */}
                <div className="w-28 h-full bg-[#eeeeec]/70 rounded-[16px] p-2 flex flex-col justify-between shrink-0">
                  <div className="flex items-center justify-around">
                    <div className="w-4 h-4 rounded-full bg-[#E3D3E8]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#CFE5D2]"></div>
                    <div className="w-5 h-5 rounded-full bg-[#F7D774]"></div>
                  </div>
                  <div className="flex items-center justify-around pl-2">
                    <div className="w-5 h-5 rounded-full bg-[#C9D8E6]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F4C9A8]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#E3D3E8]"></div>
                  </div>
                  <div className="flex items-center justify-around pr-1">
                    <div className="w-3 h-3 rounded-full bg-[#F7D774]"></div>
                    <div className="w-5 h-5 rounded-full bg-[#CFE5D2]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#C9D8E6]"></div>
                  </div>
                  <div className="flex items-center justify-around">
                    <div className="w-4 h-4 rounded-full bg-[#F4C9A8]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#E3D3E8]"></div>
                    <div className="w-5 h-5 rounded-full bg-[#C9D8E6]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3: ATTENTION REQUIRED TABLE */}
          <div className="mt-6">
            <h3 className="font-outfit text-lg font-semibold text-[#151618] mb-3">
              Attention Required
            </h3>
            {/* Table Column Header Row */}
            <div className="flex items-center px-4 font-sora text-[10px] text-[#77777b] mb-2 uppercase tracking-wider">
              <div className="w-8 shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">check_box_outline_blank</span>
              </div>
              <div className="w-32 shrink-0">TYPE</div>
              <div className="flex-1 min-w-0 pr-3">ITEM</div>
              <div className="w-28 shrink-0 hidden sm:block">SOURCE</div>
              <div className="w-32 shrink-0">STATUS</div>
              <div className="w-28 shrink-0 hidden md:block">DUE</div>
              <div className="w-8 shrink-0 text-right"></div>
            </div>

            {/* 5 Floating White Pill Rows */}
            <div className="flex flex-col gap-2">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl h-[56px] px-4 flex items-center justify-between shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="w-8 shrink-0 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id)}
                      className="w-4 h-4 rounded text-[#2A2A2C] focus:ring-0 cursor-pointer accent-[#2A2A2C]"
                    />
                  </div>

                  <div className="w-32 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full font-sora text-[10px] font-semibold text-[#151618] ${
                        task.category === 'Attendance' || task.category === 'Academics'
                          ? 'bg-[#E3D3E8]'
                          : task.category === 'Toastmasters' || task.category === 'Sync'
                          ? 'bg-[#C9D8E6]'
                          : 'bg-[#F7D774]'
                      }`}
                    >
                      {task.category}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 pr-3 font-outfit text-sm text-[#151618] font-medium truncate">
                    {task.title}
                  </div>

                  <div className="w-28 shrink-0 hidden sm:block font-outfit text-xs text-[#46464a]">
                    {task.source || 'General'}
                  </div>

                  <div className="w-32 shrink-0 flex items-center gap-1.5 font-sora text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[15px] text-[#46464a]">person</span>
                    <span
                      className={
                        task.status === 'Urgent' || task.status === 'Failed'
                          ? 'text-[#ba1a1a]'
                          : 'text-[#E8923A]'
                      }
                    >
                      {task.status}
                    </span>
                    {task.status === 'Failed' && (
                      <button
                        onClick={handleRetrySync}
                        className="underline text-xs text-[#151618] ml-1 hover:text-[#ba1a1a] cursor-pointer"
                      >
                        {retryState === 'retrying' ? '...' : retryState === 'success' ? 'OK' : 'Retry'}
                      </button>
                    )}
                  </div>

                  <div className="w-28 shrink-0 hidden md:block font-outfit text-xs text-[#151618] font-medium">
                    {task.due}
                  </div>

                  <div className="w-8 shrink-0 text-right">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="text-[#77777b] hover:text-[#151618] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. RIGHT CONTEXTUAL DETAIL PANEL ("Focus Panel") */}
        <aside className="w-full xl:w-[340px] shrink-0 bg-[#eeeeec] rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            {/* TOP PROFILE SECTION */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-md bg-white p-0.5">
                  <img
                    alt="Gowrish"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYIJzLvP_4pJ8IBGKlwCd-8O7nhgFcOVVE_FeV9aetZjdym7ofye0FfqUrKgQwJSUn6b3W8qEoH8DtI5wvWrRLDZvr1XPAjSyp3sjv671ZARu1ycHsg7PBW8D8AV1Y54sW5QFzk22RTlOjiiR-sUixq2rKiFRLQkcFAqdH41uIP8FPUdbFMffbD07_PPToAsSSaFRY-zvf2cP2-6G_03w6QWcX63pl5CjGFgEkKTqkOyU-eobSAvhEEw"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="w-3.5 h-3.5 rounded-full bg-[#4E9F6B] absolute bottom-1 right-1 ring-2 ring-white"></span>
              </div>
              <h2 className="font-outfit text-xl font-semibold text-[#151618] text-center mt-3">Gowrish</h2>
              <div className="font-sora text-[11px] text-[#77777b] text-center mt-1 flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">local_offer</span>
                <span>Next up: SOL Session #42</span>
              </div>

              {/* Three Action Circular Buttons */}
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => onSelectTab('my-day')}
                  className="w-11 h-11 rounded-full bg-[#F7D774] flex items-center justify-center text-[#151618] shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  title="Pin priority"
                >
                  <span className="material-symbols-outlined text-[20px]">star</span>
                </button>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="w-11 h-11 rounded-full bg-[#E3D3E8] flex items-center justify-center text-[#151618] shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  title={timerRunning ? 'Pause focus' : 'Start focus'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {timerRunning ? 'pause' : 'timer'}
                  </span>
                </button>
                <button
                  onClick={onOpenQuickAdd}
                  className="w-11 h-11 rounded-full bg-[#C9D8E6] flex items-center justify-center text-[#151618] shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  title="Quick add"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
            </div>

            {/* THIN DIVIDER */}
            <div className="h-[1px] bg-[#c7c6ca]/40 w-full my-5"></div>

            {/* "TODAY'S BRIEF" SECTION */}
            <div>
              <h3 className="font-outfit text-base font-semibold text-[#151618] mb-3">Today's Brief</h3>
              <div className="flex flex-col gap-3.5">
                <div className="flex items-start gap-3">
                  <span className="font-sora text-[11px] text-[#77777b] w-10 shrink-0 pt-0.5">9:00</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E3D3E8] mt-1 shrink-0"></span>
                  <span className="font-outfit text-xs font-semibold text-[#151618] leading-tight">
                    Lecture – Software Engineering
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-sora text-[11px] text-[#77777b] w-10 shrink-0 pt-0.5">11:30</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F7D774] mt-1 shrink-0"></span>
                  <span className="font-outfit text-xs text-[#151618] leading-tight">
                    Task: LENDR schema review <strong className="font-semibold text-black">(Must do)</strong>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-sora text-[11px] text-[#77777b] w-10 shrink-0 pt-0.5">4:00</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CFE5D2] mt-1 shrink-0"></span>
                  <span className="font-outfit text-xs text-[#151618] leading-tight">Habit: Gym</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-sora text-[11px] text-[#77777b] w-10 shrink-0 pt-0.5">6:30</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9D8E6] mt-1 shrink-0"></span>
                  <span className="font-outfit text-xs text-[#151618] leading-tight">SOL planning call</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM FOCUS TIMER CARD */}
          <div className="bg-white rounded-3xl p-5 shadow-sm mt-5">
            <div className="flex items-center justify-between text-[#46464a] font-sora text-xs">
              <span className="font-outfit font-semibold text-sm text-[#151618]">Focus Timer</span>
              <span className="bg-[#eeeeec] px-2.5 py-0.5 rounded-full font-mono text-[11px] text-[#151618]">
                25/5
              </span>
            </div>

            {/* Waveform audio progress track */}
            <div className="mt-4 mb-3 relative flex items-center justify-between h-9 px-1">
              <svg className="w-full h-full" fill="none" viewBox="0 0 240 36">
                {/* Completed bars */}
                <rect fill="#2A2A2C" height="16" rx="1.5" width="3" x="2" y="10" />
                <rect fill="#2A2A2C" height="24" rx="1.5" width="3" x="10" y="6" />
                <rect fill="#2A2A2C" height="8" rx="1.5" width="3" x="18" y="14" />
                <rect fill="#2A2A2C" height="28" rx="1.5" width="3" x="26" y="4" />
                <rect fill="#2A2A2C" height="20" rx="1.5" width="3" x="34" y="8" />
                <rect fill="#2A2A2C" height="12" rx="1.5" width="3" x="42" y="12" />
                <rect fill="#2A2A2C" height="32" rx="1.5" width="3" x="50" y="2" />
                <rect fill="#2A2A2C" height="20" rx="1.5" width="3" x="58" y="8" />
                <rect fill="#2A2A2C" height="8" rx="1.5" width="3" x="66" y="14" />
                <rect fill="#2A2A2C" height="24" rx="1.5" width="3" x="74" y="6" />
                <rect fill="#2A2A2C" height="16" rx="1.5" width="3" x="82" y="10" />
                <rect fill="#2A2A2C" height="28" rx="1.5" width="3" x="90" y="4" />
                <rect fill="#2A2A2C" height="12" rx="1.5" width="3" x="98" y="12" />
                <rect fill="#2A2A2C" height="20" rx="1.5" width="3" x="106" y="8" />
                <rect fill="#2A2A2C" height="8" rx="1.5" width="3" x="114" y="14" />
                {/* Red playhead */}
                <line stroke="#D9534F" strokeLinecap="round" strokeWidth="2" x1="120" x2="120" y1="0" y2="36" />
                <circle cx="120" cy="2" fill="#D9534F" r="3" />
                {/* Remaining bars */}
                <rect fill="#DADAD8" height="24" rx="1.5" width="3" x="126" y="6" />
                <rect fill="#DADAD8" height="16" rx="1.5" width="3" x="134" y="10" />
                <rect fill="#DADAD8" height="32" rx="1.5" width="3" x="142" y="2" />
                <rect fill="#DADAD8" height="12" rx="1.5" width="3" x="150" y="12" />
                <rect fill="#DADAD8" height="20" rx="1.5" width="3" x="158" y="8" />
                <rect fill="#DADAD8" height="8" rx="1.5" width="3" x="166" y="14" />
                <rect fill="#DADAD8" height="28" rx="1.5" width="3" x="174" y="4" />
                <rect fill="#DADAD8" height="20" rx="1.5" width="3" x="182" y="8" />
                <rect fill="#DADAD8" height="12" rx="1.5" width="3" x="190" y="12" />
                <rect fill="#DADAD8" height="24" rx="1.5" width="3" x="198" y="6" />
                <rect fill="#DADAD8" height="16" rx="1.5" width="3" x="206" y="10" />
                <rect fill="#DADAD8" height="8" rx="1.5" width="3" x="214" y="14" />
                <rect fill="#DADAD8" height="20" rx="1.5" width="3" x="222" y="8" />
                <rect fill="#DADAD8" height="12" rx="1.5" width="3" x="230" y="12" />
              </svg>
            </div>

            {/* Time Display */}
            <div className="flex items-baseline justify-between font-mono">
              <span className="font-outfit text-xl font-bold text-[#151618]">
                {formatTimer(timerSeconds)}
              </span>
              <span className="text-xs text-[#77777b]">/ 25:00</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-3">
              <button
                onClick={() => setTimerSeconds((prev) => Math.max(0, prev - 10))}
                className="text-[#77777b] hover:text-[#151618] transition-colors cursor-pointer"
                title="Rewind 10s"
              >
                <span className="material-symbols-outlined text-[20px]">replay_10</span>
              </button>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="w-10 h-10 rounded-full bg-[#2A2A2C] text-white flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                title={timerRunning ? 'Pause' : 'Start'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {timerRunning ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <button
                onClick={() => setTimerSeconds((prev) => prev + 10)}
                className="text-[#77777b] hover:text-[#151618] transition-colors cursor-pointer"
                title="Forward 10s"
              >
                <span className="material-symbols-outlined text-[20px]">forward_10</span>
              </button>
            </div>

            {/* Subtitle Link */}
            <div className="mt-3 pt-2 text-center flex items-center justify-center gap-1 font-outfit text-xs text-[#77777b]">
              <span className="material-symbols-outlined text-[15px]">link</span>
              <button
                onClick={() => onSelectTab('academics')}
                className="hover:text-[#151618] transition-colors truncate underline"
              >
                Linked task: LENDR schema
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
