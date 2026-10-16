import React, { useState } from 'react';
import { TaskItem, HabitItem, NavTabId } from '../../types';
import confetti from 'canvas-confetti';

interface MyDayViewProps {
  tasks: TaskItem[];
  habits: HabitItem[];
  onToggleTask: (id: string) => void;
  onToggleHabit: (id: string) => void;
  onSelectTab: (tab: NavTabId) => void;
  onOpenQuickAdd: () => void;
}

export const MyDayView: React.FC<MyDayViewProps> = ({
  tasks,
  habits,
  onToggleTask,
  onToggleHabit,
  onSelectTab,
  onOpenQuickAdd,
}) => {
  // Plan filter tabs
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'done'>('all');
  const [quickNote, setQuickNote] = useState('');
  const [notesList, setNotesList] = useState([
    'Reminder: check latency metrics before Friday demo with team. Also verify database indexing on LENDR collection schema.',
  ]);

  // Pomodoro timer state
  const [pomodoroSeconds, setPomodoroSeconds] = useState(1500); // 25:00
  const [pomodoroActive, setPomodoroActive] = useState(false);

  // End of day debrief answers
  const [q1, setQ1] = useState('5 of 8 tasks logged, plus push workout completed.');
  const [q2, setQ2] = useState('DSA practice, Microsoft reading, Toastmasters draft.');
  const [q3, setQ3] = useState('High focus on software engineering prep and audio cleanup.');
  const [rescheduleUnfinished, setRescheduleUnfinished] = useState(true);
  const [keepUnscheduled, setKeepUnscheduled] = useState(false);
  const [savedDebrief, setSavedDebrief] = useState(false);

  React.useEffect(() => {
    let interval: any;
    if (pomodoroActive && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroSeconds]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const filteredTasks = tasks.filter((t) => {
    if (filterMode === 'pending') return !t.completed;
    if (filterMode === 'done') return t.completed;
    return true;
  });

  const handleSaveDebrief = () => {
    setSavedDebrief(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#E3D3E8', '#F7D774', '#CFE5D2', '#C9D8E6'],
    });
    setTimeout(() => setSavedDebrief(false), 3000);
  };

  const handleAddNote = () => {
    if (!quickNote.trim()) return;
    setNotesList([quickNote, ...notesList]);
    setQuickNote('');
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* SUBHEADER / VIEW META BAR */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-outfit text-2xl lg:text-3xl font-semibold text-[#151618] tracking-tight">
              Today, 16 Oct
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d5e4f3] text-[#0f1d27] font-sora text-[10px] uppercase font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4E9F6B]"></span>
              Active Run
            </span>
          </div>
          <p className="font-outfit text-sm text-[#46464a] mt-1">
            <span className="font-semibold text-[#151618]">{completedCount} of {totalCount} tasks done</span> • Momentum is at 78% for this sprint
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search field */}
          <div className="relative flex-1 md:w-72">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#77777b] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search today's plan, notes, tags..."
              className="w-full h-[48px] pl-11 pr-4 rounded-full bg-white text-xs font-outfit text-[#151618] placeholder:text-[#77777b] outline-none shadow-sm focus:ring-2 focus:ring-[#C9D8E6] transition-all"
            />
          </div>

          <button
            onClick={onOpenQuickAdd}
            className="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center text-[#151618] shadow-sm hover:bg-[#f4f4f2] transition-colors cursor-pointer"
            title="Quick Add"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>

          <div className="hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white shadow-sm text-xs font-outfit text-[#46464a]">
            <span className="material-symbols-outlined text-[16px] text-[#4E9F6B]">sync</span>
            <span>Last synced 4 min ago</span>
            <span className="text-[#c7c6ca]">•</span>
            <span className="font-sora text-[10px] uppercase text-[#77777b]">Sample data</span>
          </div>
        </div>
      </section>

      {/* MAIN 2-COLUMN OS BENTO LAYOUT (8 cols workstream + 4 cols contextual focus rail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PRIMARY COLUMN (8 cols): Stat Cards, Today's Plan, Habits & Notes */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* ROW 1: THREE EQUAL PASTEL STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Lilac Card (#E3D3E8) */}
            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[144px] bg-[#E3D3E8] text-[#1E1E1E] shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="font-sora text-[11px] font-semibold uppercase tracking-wider text-[#4E4354]">
                  Must Do
                </span>
                <span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-[#4E4354]">priority_high</span>
                </span>
              </div>
              <div className="flex items-end justify-between mt-2">
                <div>
                  <div className="font-outfit text-4xl font-bold leading-none tracking-tight">3/4</div>
                  <span className="font-outfit text-xs text-[#4E4354]/80 mt-1 block">75% completed</span>
                </div>
                <button
                  onClick={() => setFilterMode('all')}
                  className="px-4 py-2 rounded-full bg-white text-[#151618] font-sora text-xs font-semibold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Check</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* 2. Powder Blue Card (#C9D8E6) */}
            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[144px] bg-[#C9D8E6] text-[#1E1E1E] shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="font-sora text-[11px] font-semibold uppercase tracking-wider text-[#3A4854]">
                  Should Do
                </span>
                <span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-[#3A4854]">adjust</span>
                </span>
              </div>
              <div className="flex items-end justify-between mt-2">
                <div>
                  <div className="font-outfit text-4xl font-bold leading-none tracking-tight">1/3</div>
                  <span className="font-outfit text-xs text-[#3A4854]/80 mt-1 block">2 remaining</span>
                </div>
                <button
                  onClick={() => setFilterMode('pending')}
                  className="px-4 py-2 rounded-full bg-white text-[#151618] font-sora text-xs font-semibold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Check</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* 3. Warm Yellow Card (#F7D774) */}
            <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[144px] bg-[#F7D774] text-[#1E1E1E] shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="font-sora text-[11px] font-semibold uppercase tracking-wider text-[#735A12]">
                  If Time Permits
                </span>
                <span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-[#735A12]">schedule</span>
                </span>
              </div>
              <div className="flex items-end justify-between mt-2">
                <div>
                  <div className="font-outfit text-4xl font-bold leading-none tracking-tight">1/1</div>
                  <span className="font-outfit text-xs text-[#735A12]/80 mt-1 block">Bonus achieved</span>
                </div>
                <button
                  onClick={() => setFilterMode('done')}
                  className="px-4 py-2 rounded-full bg-white text-[#151618] font-sora text-xs font-semibold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Check</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* ROW 2: MAIN CARD: "Today's Plan" (Split Priorities & Time-block schedule) */}
          <section className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1 border-b border-black/5">
              <div>
                <h2 className="font-outfit text-xl font-semibold text-[#151618]">Today's Plan</h2>
                <p className="font-outfit text-xs text-[#46464a]">
                  Prioritized task execution paired directly against dynamic calendar time slots
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#f4f4f2] text-[#46464a] font-sora text-[10px] font-medium">
                  8 Scheduled Blocks
                </span>
                <button
                  onClick={onOpenQuickAdd}
                  className="w-8 h-8 rounded-full bg-[#f4f4f2] hover:bg-[#e8e8e6] flex items-center justify-center text-[#151618] transition-colors cursor-pointer"
                  title="Add Task"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>

            {/* 2 Balanced Columns Split Inside Main Plan */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* LEFT SUB-COLUMN: Priorities with filter/sort (7 cols on xl) */}
              <div className="xl:col-span-7 flex flex-col gap-5">
                {/* Filter / Tabs */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-1 bg-[#f4f4f2] p-1 rounded-full">
                    <button
                      onClick={() => setFilterMode('all')}
                      className={`px-3 py-1 rounded-full font-sora text-xs font-semibold transition-all cursor-pointer ${
                        filterMode === 'all'
                          ? 'bg-white text-[#151618] shadow-xs'
                          : 'text-[#52606c] hover:text-[#151618]'
                      }`}
                    >
                      All Tasks ({tasks.length})
                    </button>
                    <button
                      onClick={() => setFilterMode('pending')}
                      className={`px-3 py-1 rounded-full font-sora text-xs font-semibold transition-all cursor-pointer ${
                        filterMode === 'pending'
                          ? 'bg-white text-[#151618] shadow-xs'
                          : 'text-[#52606c] hover:text-[#151618]'
                      }`}
                    >
                      Pending ({tasks.filter((t) => !t.completed).length})
                    </button>
                    <button
                      onClick={() => setFilterMode('done')}
                      className={`px-3 py-1 rounded-full font-sora text-xs font-semibold transition-all cursor-pointer ${
                        filterMode === 'done'
                          ? 'bg-white text-[#151618] shadow-xs'
                          : 'text-[#52606c] hover:text-[#151618]'
                      }`}
                    >
                      Done ({tasks.filter((t) => t.completed).length})
                    </button>
                  </div>
                  <span className="flex items-center gap-1 text-[#52606c] font-sora text-[11px]">
                    <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                    <span>Urgency</span>
                  </span>
                </div>

                {/* Task Item Rows by Priority */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-sora text-[11px] font-semibold uppercase tracking-wider text-[#4E4354] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E3D3E8]"></span>
                      Priority Run
                    </span>
                    <span className="font-sora text-[10px] text-[#77777b]">
                      {filteredTasks.length} visible
                    </span>
                  </div>

                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group flex items-center justify-between gap-3 p-3.5 rounded-2xl transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-[#f4f4f2]/70 hover:bg-[#f4f4f2]'
                          : 'bg-white ring-1 ring-black/5 shadow-xs hover:shadow-md'
                      }`}
                      onClick={() => onToggleTask(task.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="material-symbols-outlined text-[#c7c6ca] cursor-grab text-[18px] opacity-40 group-hover:opacity-100">
                          drag_indicator
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            task.completed
                              ? 'bg-[#4E9F6B] text-white'
                              : 'bg-[#eeeeec] hover:bg-[#CFE5D2]'
                          }`}
                        >
                          {task.completed ? (
                            <span className="material-symbols-outlined text-[15px]">check</span>
                          ) : (
                            <span className="w-3 h-3 rounded-full border border-[#77777b]"></span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`font-outfit text-sm truncate block ${
                              task.completed
                                ? 'line-through text-[#77777b]'
                                : 'text-[#151618] font-medium'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-sora text-[10px] uppercase font-semibold ${
                            task.category === 'Academics'
                              ? 'bg-[#E3D3E8] text-[#4E4354]'
                              : task.category === 'Toastmasters'
                              ? 'bg-[#C9D8E6] text-[#3A4854]'
                              : task.category === 'Career'
                              ? 'bg-[#F7D774] text-[#735A12]'
                              : task.category === 'Creative'
                              ? 'bg-[#F4C9A8] text-[#9E5D2A]'
                              : 'bg-[#CFE5D2] text-[#2D5A38]'
                          }`}
                        >
                          {task.category}
                        </span>
                        {task.duration && (
                          <span className="font-outfit text-xs text-[#77777b] hidden sm:inline">
                            {task.duration}
                          </span>
                        )}
                        <span className="font-sora text-[10px] text-[#46464a] bg-[#eeeeec] px-2 py-0.5 rounded-full">
                          {task.due}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT SUB-COLUMN: Time-block schedule (5 cols on xl) */}
              <div className="xl:col-span-5 bg-[#f4f4f2] rounded-2xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-outfit text-sm font-semibold text-[#151618]">
                      Time-block schedule
                    </h3>
                    <span className="font-outfit text-xs text-[#77777b]">8:00 AM – 10:00 PM</span>
                  </div>
                  <button
                    onClick={onOpenQuickAdd}
                    className="px-3 py-1 rounded-full bg-[#151618] text-white font-sora text-[11px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">add</span>
                    <span>Add block</span>
                  </button>
                </div>

                {/* Vertical Timeline Container */}
                <div className="relative overflow-hidden pt-1 pb-1">
                  <div className="flex flex-col gap-4 relative font-sora text-[10px] text-[#77777b]">
                    {/* 8:00 */}
                    <div className="flex items-center gap-3 relative h-6">
                      <span className="w-12 text-right shrink-0">8:00 AM</span>
                      <div className="flex-1 h-[1px] bg-[#c7c6ca]/40"></div>
                    </div>
                    {/* 9:00 */}
                    <div className="flex items-center gap-3 relative h-10">
                      <span className="w-12 text-right shrink-0">9:00 AM</span>
                      <div className="flex-1 h-[1px] bg-[#c7c6ca]/40 relative">
                        <div className="absolute left-0 top-0 w-full h-10 -mt-1 bg-[#E3D3E8] rounded-xl px-3 flex items-center justify-between text-[#1E1E1E] shadow-xs">
                          <div className="truncate">
                            <span className="font-sora text-[11px] font-semibold block truncate">
                              Lecture: Software Eng
                            </span>
                            <span className="text-[9px] text-[#4E4354]">9:00 - 10:30 AM</span>
                          </div>
                          <span className="material-symbols-outlined text-[16px] text-[#4E4354]">
                            check_circle
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 10:00 */}
                    <div className="flex items-center gap-3 relative h-6">
                      <span className="w-12 text-right shrink-0">10:00 AM</span>
                      <div className="flex-1 h-[1px] bg-[#c7c6ca]/40"></div>
                    </div>
                    {/* 11:00 */}
                    <div className="flex items-center gap-3 relative h-9">
                      <span className="w-12 text-right shrink-0">11:00 AM</span>
                      <div className="flex-1 h-[1px] bg-[#c7c6ca]/40 relative">
                        <div className="absolute left-0 top-1.5 w-full h-8 bg-[#E3D3E8] rounded-xl px-3 flex items-center justify-between text-[#1E1E1E] shadow-xs">
                          <span className="font-sora text-[11px] font-semibold truncate">
                            LENDR Schema Review (11:30)
                          </span>
                          <span className="material-symbols-outlined text-[16px] text-[#4E4354]">
                            check_circle
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 1:00 PM */}
                    <div className="flex items-center gap-3 relative h-8">
                      <span className="w-12 text-right shrink-0">1:00 PM</span>
                      <div className="flex-1 h-[1px] bg-[#c7c6ca]/40 relative">
                        <div className="absolute left-0 top-2 w-full h-7 bg-[#F4C9A8] rounded-xl px-3 flex items-center justify-between text-[#1E1E1E] shadow-xs">
                          <span className="font-sora text-[10px] font-semibold truncate">
                            Creative audio test (1:30 - 2:00)
                          </span>
                          <span className="material-symbols-outlined text-[15px] text-[#9E5D2A]">
                            check_circle
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 2:00 PM */}
                    <div className="flex items-center gap-3 relative h-8">
                      <span className="w-12 text-right shrink-0">2:00 PM</span>
                      <div className="flex-1 h-[1px] bg-[#c7c6ca]/40 relative">
                        <div className="absolute left-0 top-0 w-full h-7 bg-[#C9D8E6] rounded-xl px-3 flex items-center justify-between text-[#1E1E1E] shadow-xs">
                          <span className="font-sora text-[10px] font-semibold truncate">
                            Toastmasters prep (2:00 - 2:30)
                          </span>
                          <span className="material-symbols-outlined text-[15px] text-[#3A4854]">
                            check_circle
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 3:00 PM & CURRENT TIME BAR */}
                    <div className="flex items-center gap-3 relative h-8">
                      <span className="w-12 text-right shrink-0">3:00 PM</span>
                      <div className="flex-1 h-[1px] bg-[#c7c6ca]/40 relative">
                        <div className="absolute left-0 top-3.5 w-full flex items-center z-10">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#BA1A1A] ring-2 ring-white -ml-1"></span>
                          <div className="flex-1 h-[2px] bg-[#BA1A1A]"></div>
                          <span className="px-2 py-0.5 rounded-full bg-[#BA1A1A] text-white text-[9px] font-sora font-bold tracking-wider uppercase ml-1 shadow-sm">
                            3:45 PM Now
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 4:00 PM */}
                    <div className="flex items-center gap-3 relative h-9">
                      <span className="w-12 text-right shrink-0">4:00 PM</span>
                      <div className="flex-1 h-[1px] bg-[#c7c6ca]/40 relative">
                        <div className="absolute left-0 top-0 w-full h-8 bg-[#CFE5D2] rounded-xl px-3 flex items-center justify-between text-[#1E1E1E] shadow-xs">
                          <span className="font-sora text-[10px] font-semibold truncate">
                            Gym: Push Day (4:00 - 5:00)
                          </span>
                          <span className="material-symbols-outlined text-[15px] text-[#2D5A38]">
                            fitness_center
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 5:00 PM */}
                    <div className="flex items-center gap-3 relative h-9">
                      <span className="w-12 text-right shrink-0">5:00 PM</span>
                      <div className="flex-1 h-[1px] bg-[#c7c6ca]/40 relative">
                        <div className="absolute left-0 top-1.5 w-full h-8 bg-[#E3D3E8] rounded-xl px-3 flex items-center justify-between text-[#1E1E1E] ring-1 ring-black/10 shadow-xs">
                          <span className="font-sora text-[10px] font-semibold truncate">
                            DSA Graph Practice (5:30 - 6:30)
                          </span>
                          <span className="material-symbols-outlined text-[15px] text-[#4E4354]">
                            code
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 7:00 PM */}
                    <div className="flex items-center gap-3 relative h-9">
                      <span className="w-12 text-right shrink-0">7:00 PM</span>
                      <div className="flex-1 h-[1px] bg-[#c7c6ca]/40 relative">
                        <div className="absolute left-0 top-2 w-full h-8 bg-[#F7D774] rounded-xl px-3 flex items-center justify-between text-[#1E1E1E] shadow-xs">
                          <span className="font-sora text-[10px] font-semibold truncate">
                            Career Study (7:30 - 8:30)
                          </span>
                          <span className="material-symbols-outlined text-[15px] text-[#735A12]">
                            menu_book
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 9:00 PM */}
                    <div className="flex items-center gap-3 relative h-8">
                      <span className="w-12 text-right shrink-0">9:00 PM</span>
                      <div className="flex-1 h-[1px] bg-[#c7c6ca]/40 relative">
                        <div className="absolute left-0 top-0 w-full h-7 bg-[#C9D8E6] rounded-xl px-3 flex items-center justify-between text-[#1E1E1E] shadow-xs">
                          <span className="font-sora text-[10px] font-semibold truncate">
                            SOL planning call (9:00 - 9:30)
                          </span>
                          <span className="material-symbols-outlined text-[15px] text-[#3A4854]">
                            call
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ROW 3: BOTTOM TWO CARDS (Habits & Notes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. DAILY HABITS CARD */}
            <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-outfit text-base font-semibold text-[#151618]">Daily Habits</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#CFE5D2] text-[#2D5A38] font-sora text-[10px] font-bold">
                    80% Done
                  </span>
                </div>
                <p className="font-outfit text-xs text-[#77777b] flex items-center gap-1.5">
                  <span>4 of 5 logged today</span>
                  <span>•</span>
                  <span className="text-[#9E5D2A] font-medium flex items-center">
                    12 day streak <span className="material-symbols-outlined text-[15px] ml-0.5">local_fire_department</span>
                  </span>
                </p>
              </div>

              {/* 5 Habit Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {habits.slice(0, 5).map((habit) => (
                  <button
                    key={habit.id}
                    onClick={() => onToggleHabit(habit.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-outfit text-xs font-medium shadow-xs transition-all cursor-pointer ${
                      habit.history[4] // Friday done
                        ? 'bg-[#CFE5D2] text-[#1E1E1E] hover:scale-[1.02]'
                        : 'bg-[#eeeeec] text-[#77777b] hover:bg-[#e8e8e6]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${
                        habit.history[4] ? 'bg-[#2D5A38]' : 'border border-[#77777b]'
                      }`}
                    >
                      {habit.history[4] && <span className="material-symbols-outlined text-[11px]">check</span>}
                    </span>
                    <span>{habit.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between font-sora text-[10px] text-[#77777b]">
                <span>Next reset at 12:00 AM</span>
                <button
                  onClick={() => onSelectTab('habits-and-wellness')}
                  className="hover:text-[#151618] transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View streak calendar</span>
                  <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* 2. DAILY NOTES CARD */}
            <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-outfit text-base font-semibold text-[#151618]">Daily Notes</h3>
                  <span className="font-outfit text-xs text-[#77777b]">Today 2:15 PM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F4C9A8]/50 text-[#9E5D2A] font-sora text-[10px] font-semibold uppercase">
                    Idea
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#eeeeec] text-[#46464a] font-sora text-[10px] font-semibold uppercase">
                    Log
                  </span>
                </div>
              </div>

              {/* Pastel Note Area */}
              <div className="bg-[#f4f4f2] rounded-2xl p-3.5 flex flex-col gap-2 relative">
                <p className="font-outfit text-xs text-[#151618] font-medium leading-relaxed">
                  {notesList[0]}
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-[#77777b] font-sora">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#4E9F6B]">check_circle</span>
                    Synced to Notion
                  </span>
                  <span>Updated 30m ago</span>
                </div>
              </div>

              {/* Quick capture input pill */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddNote();
                  }}
                  placeholder="Capture a thought…"
                  className="flex-1 h-9 px-4 rounded-full bg-[#f4f4f2] text-xs font-outfit text-[#151618] placeholder:text-[#77777b] outline-none focus:ring-1 focus:ring-[#C9D8E6]"
                />
                <button
                  onClick={handleAddNote}
                  className="w-9 h-9 rounded-full bg-[#2A2A2C] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                  title="Save quick note"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTEXTUAL PANEL (4 cols): Profile, Focus Timer, End-of-Day Review */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Gowrish mini-profile bar */}
          <div className="bg-white rounded-3xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  alt="Gowrish"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYIJzLvP_4pJ8IBGKlwCd-8O7nhgFcOVVE_FeV9aetZjdym7ofye0FfqUrKgQwJSUn6b3W8qEoH8DtI5wvWrRLDZvr1XPAjSyp3sjv671ZARu1ycHsg7PBW8D8AV1Y54sW5QFzk22RTlOjiiR-sUixq2rKiFRLQkcFAqdH41uIP8FPUdbFMffbD07_PPToAsSSaFRY-zvf2cP2-6G_03w6QWcX63pl5CjGFgEkKTqkOyU-eobSAvhEEw"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[#CFE5D2]"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4E9F6B] ring-2 ring-white"></span>
              </div>
              <div>
                <h4 className="font-outfit font-semibold text-sm text-[#151618] leading-tight">Gowrish</h4>
                <span className="font-outfit text-xs text-[#77777b] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4E9F6B]"></span>
                  Deep Focus Mode
                </span>
              </div>
            </div>
            <button
              onClick={() => setPomodoroActive(!pomodoroActive)}
              className="w-9 h-9 rounded-full bg-[#f4f4f2] hover:bg-[#e8e8e6] flex items-center justify-center text-[#151618] transition-colors cursor-pointer"
              title="Toggle soundscapes / Focus"
            >
              <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
            </button>
          </div>

          {/* FOCUS TIMER CARD WITH CIRCLE PROGRESS RING */}
          <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center gap-5">
            <div className="w-full flex items-center justify-between">
              <span className="font-sora text-[11px] font-semibold uppercase tracking-wider text-[#77777b]">
                Focus Timer
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d5e4f3] text-[#0f1d27] font-sora text-[10px] font-semibold">
                Pomodoro 25m
              </span>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative w-44 h-44 flex items-center justify-center my-1">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" fill="transparent" r="68" stroke="#EEEEEC" strokeWidth="9" />
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="68"
                  stroke="#2A2A2C"
                  strokeDasharray="427"
                  strokeDashoffset={427 - (pomodoroSeconds / 1500) * 427}
                  strokeLinecap="round"
                  strokeWidth="9"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-outfit text-4xl font-bold tracking-tight text-[#151618]">
                  {formatTimer(pomodoroSeconds)}
                </span>
                <span className="font-sora text-[9px] text-[#77777b] uppercase tracking-widest mt-1">
                  Focus Session
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 w-full">
              <button
                onClick={() => setPomodoroSeconds(1500)}
                className="w-10 h-10 rounded-full bg-[#f4f4f2] text-[#151618] flex items-center justify-center hover:bg-[#e8e8e6] transition-colors shadow-xs cursor-pointer"
                title="Reset"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
              <button
                onClick={() => setPomodoroActive(!pomodoroActive)}
                className="px-7 py-2.5 rounded-full bg-[#2A2A2C] text-white font-sora text-xs font-bold tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {pomodoroActive ? 'pause' : 'play_arrow'}
                </span>
                <span>{pomodoroActive ? 'Pause' : 'Start'}</span>
              </button>
              <button
                onClick={() => setPomodoroSeconds((prev) => Math.min(3600, prev + 300))}
                className="w-10 h-10 rounded-full bg-[#f4f4f2] text-[#151618] flex items-center justify-center hover:bg-[#e8e8e6] transition-colors shadow-xs cursor-pointer"
                title="+5 min"
              >
                <span className="font-sora text-[10px] font-bold">+5m</span>
              </button>
            </div>

            {/* Linked Task Selector */}
            <div className="w-full bg-[#f4f4f2] rounded-2xl p-3 flex flex-col gap-1">
              <span className="font-sora text-[9px] text-[#77777b] uppercase tracking-wider">
                Linked Task
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#E3D3E8]"></span>
                  <span className="font-outfit text-xs text-[#151618] font-semibold truncate">
                    DSA Graph traversal practice
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#77777b]">
                  arrow_drop_down
                </span>
              </div>
            </div>

            {/* Today's Completed Sessions */}
            <div className="w-full flex flex-col gap-2 pt-1 border-t border-black/5">
              <span className="font-sora text-[10px] font-semibold uppercase tracking-wider text-[#77777b]">
                Today's Completed Sessions
              </span>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#f9f9f7] text-xs font-outfit">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E3D3E8]"></span>
                  <span className="font-medium text-[#151618]">10:05 • 25 min</span>
                </div>
                <span className="text-[#77777b] truncate">DSA arrays</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#f9f9f7] text-xs font-outfit">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E3D3E8]"></span>
                  <span className="font-medium text-[#151618]">11:40 • 25 min</span>
                </div>
                <span className="text-[#77777b] truncate">LENDR schema</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#f9f9f7] text-xs font-outfit">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C9D8E6]"></span>
                  <span className="font-medium text-[#151618]">2:10 • 25 min</span>
                </div>
                <span className="text-[#77777b] truncate">SOL slides</span>
              </div>
            </div>
          </div>

          {/* END-OF-DAY REVIEW MODAL CARD */}
          <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col gap-4">
            <div className="w-full py-3 px-5 rounded-full bg-[#F7D774] text-[#1E1E1E] font-outfit text-sm font-semibold flex items-center justify-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">nightlight</span>
              <span>End-of-day review</span>
            </div>

            <div className="bg-[#f4f4f2] rounded-2xl p-4 flex flex-col gap-3.5">
              <div className="flex items-center justify-between border-b border-black/5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#735A12]">fact_check</span>
                  <h5 className="font-outfit text-sm font-semibold text-[#151618]">Daily Debrief</h5>
                </div>
                <span className="font-sora text-[10px] text-[#77777b]">4 Questions</span>
              </div>

              {/* Q1 */}
              <div className="flex flex-col gap-1">
                <label className="font-sora text-[11px] font-semibold text-[#151618]">
                  1. What did I complete?
                </label>
                <input
                  type="text"
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white text-xs font-outfit text-[#46464a] border-none outline-none focus:ring-1 focus:ring-[#C9D8E6]"
                />
              </div>

              {/* Q2 */}
              <div className="flex flex-col gap-1">
                <label className="font-sora text-[11px] font-semibold text-[#151618]">
                  2. What remains?
                </label>
                <input
                  type="text"
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white text-xs font-outfit text-[#46464a] border-none outline-none focus:ring-1 focus:ring-[#C9D8E6]"
                />
              </div>

              {/* Q3 */}
              <div className="flex flex-col gap-1">
                <label className="font-sora text-[11px] font-semibold text-[#151618]">
                  3. What went well?
                </label>
                <input
                  type="text"
                  value={q3}
                  onChange={(e) => setQ3(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white text-xs font-outfit text-[#46464a] border-none outline-none focus:ring-1 focus:ring-[#C9D8E6]"
                />
              </div>

              {/* Q4 */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sora text-[11px] font-semibold text-[#151618]">
                  4. What moves to tomorrow?
                </label>
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <label className="flex items-center gap-2 text-xs font-outfit text-[#151618] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rescheduleUnfinished}
                      onChange={() => setRescheduleUnfinished(!rescheduleUnfinished)}
                      className="rounded accent-[#151618]"
                    />
                    <span>Reschedule remaining 3 tasks</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-outfit text-[#77777b] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keepUnscheduled}
                      onChange={() => setKeepUnscheduled(!keepUnscheduled)}
                      className="rounded accent-[#151618]"
                    />
                    <span>Keep in unscheduled list</span>
                  </label>
                </div>
              </div>

              {/* Save Review Action */}
              <button
                onClick={handleSaveDebrief}
                className={`w-full mt-2 py-2.5 rounded-full font-sora text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  savedDebrief
                    ? 'bg-[#4E9F6B] text-white'
                    : 'bg-[#151618] text-white hover:opacity-90 active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {savedDebrief ? 'check_circle' : 'save'}
                </span>
                <span>{savedDebrief ? 'Review Recorded!' : 'Save Review'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
