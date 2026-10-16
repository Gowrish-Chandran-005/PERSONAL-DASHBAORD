import React, { useState } from 'react';
import { CalendarEvent } from '../../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onOpenQuickAdd: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onOpenQuickAdd }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('ev-21');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day' | 'Agenda'>('Month');
  const [linkedTasks, setLinkedTasks] = useState([
    { id: '1', text: 'Revise UML diagrams & Class relationships', done: true },
    { id: '2', text: 'Review Design Patterns chapter 4-7', done: false },
    { id: '3', text: 'Solve previous year CAT-1 paper (2024)', done: false },
  ]);
  const [reminders, setReminders] = useState([
    '1 day before (20 Oct, 9:30 AM)',
    '2 hours before (21 Oct, 7:30 AM)',
  ]);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const categories = [
    { name: 'All', count: 28, color: '#151618' },
    { name: 'College & Exams', count: 9, color: '#E3D3E8' },
    { name: 'Toastmasters', count: 5, color: '#C9D8E6' },
    { name: 'Career & Internships', count: 4, color: '#F7D774' },
    { name: 'Creative Studio', count: 3, color: '#F4C9A8' },
    { name: 'Habits & Routine', count: 5, color: '#CFE5D2' },
    { name: 'Personal', count: 2, color: '#EAEAEA' },
  ];

  const toggleLinkedTask = (id: string) => {
    setLinkedTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const removeReminder = (index: number) => {
    setReminders((prev) => prev.filter((_, i) => i !== index));
  };

  const addReminder = () => {
    setReminders((prev) => [...prev, '30 min before (21 Oct, 9:00 AM)']);
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* TOP HEADER / ACTION BAR */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Month Title & Date Badge */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <h1 className="font-outfit text-2xl lg:text-3xl font-semibold text-[#151618] tracking-tight">
              October 2026
            </h1>
            <div className="flex items-center bg-[#eeeeec] rounded-full p-1 shadow-xs">
              <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-[#77777b] hover:text-[#151618] transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <button className="px-3 py-0.5 rounded-full font-sora text-xs text-[#151618] hover:bg-white transition-all cursor-pointer font-medium">
                Today
              </button>
              <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-[#77777b] hover:text-[#151618] transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f4f4f2] text-[#46464a] font-sora text-xs">
            <span className="w-2 h-2 rounded-full bg-[#151618]"></span>
            <span>16 Oct selected • Term Week 8</span>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented View Toggle */}
          <div className="flex items-center bg-[#eeeeec] p-1 rounded-full shadow-xs">
            {(['Month', 'Week', 'Day', 'Agenda'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3.5 py-1.5 rounded-full font-sora text-xs transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-[#151618] text-white shadow-xs font-semibold'
                    : 'text-[#52606c] hover:text-[#151618]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#77777b]">search</span>
            <input
              type="text"
              placeholder="Search events, tags..."
              className="h-10 pl-9 pr-4 w-40 md:w-52 bg-white rounded-full font-outfit text-xs text-[#151618] placeholder:text-[#77777b] outline-none shadow-xs"
            />
          </div>

          {/* Add Event CTA */}
          <button
            onClick={onOpenQuickAdd}
            className="h-10 px-4 rounded-full bg-[#F7D774] text-[#151618] hover:opacity-90 font-sora text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>Event</span>
          </button>
        </div>
      </div>

      {/* MAIN CALENDAR & CONTEXTUAL PANEL SPLIT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* LEFT / CENTER: MONTH CARD */}
        <div className="xl:col-span-8 2xl:col-span-9 bg-white rounded-3xl p-6 shadow-sm flex flex-col">
          {/* Category Filter Chips & Month Sub-navigation */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 mb-4 border-b border-black/5">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sora text-xs transition-all cursor-pointer ${
                    activeCategory === cat.name
                      ? 'bg-[#151618] text-white shadow-xs font-semibold'
                      : 'bg-[#f4f4f2] hover:bg-[#e8e8e6] text-[#151618]'
                  }`}
                >
                  {cat.color !== '#151618' && (
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  )}
                  <span>
                    {cat.name} ({cat.count})
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[#52606c] font-sora text-xs shrink-0 self-end lg:self-center">
              <button className="p-1 hover:text-[#151618] flex items-center transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[15px]">chevron_left</span>
                <span>Sep</span>
              </button>
              <span className="px-1 text-[#c7c6ca]">•</span>
              <button className="p-1 hover:text-[#151618] flex items-center transition-colors cursor-pointer">
                <span>Nov</span>
                <span className="material-symbols-outlined text-[15px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* CALENDAR MONTH VIEW GRID */}
          <div className="w-full flex flex-col">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <div key={day} className="font-sora text-[11px] font-semibold text-[#77777b] tracking-wider py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid (5 Weeks) */}
            <div className="grid grid-cols-7 gap-2">
              {/* Prev month days */}
              <div className="min-h-[102px] p-2 bg-[#f4f4f2]/40 rounded-2xl flex flex-col opacity-40">
                <span className="text-right font-sora text-xs text-[#77777b]">28</span>
              </div>
              <div className="min-h-[102px] p-2 bg-[#f4f4f2]/40 rounded-2xl flex flex-col opacity-40">
                <span className="text-right font-sora text-xs text-[#77777b]">29</span>
              </div>
              <div className="min-h-[102px] p-2 bg-[#f4f4f2]/40 rounded-2xl flex flex-col opacity-40">
                <span className="text-right font-sora text-xs text-[#77777b]">30</span>
              </div>

              {/* Days 1 to 31 */}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
                const dayEvents = events.filter((e) => e.day === dayNum);
                const isToday = dayNum === 16;
                const isSelected = selectedEvent.day === dayNum;

                return (
                  <div
                    key={dayNum}
                    onClick={() => {
                      if (dayEvents.length > 0) {
                        setSelectedEventId(dayEvents[0].id);
                        setRightPanelOpen(true);
                      }
                    }}
                    className={`min-h-[102px] p-2 rounded-2xl flex flex-col transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#e8e8e6] ring-2 ring-[#151618] shadow-md'
                        : isToday
                        ? 'bg-[#d5e4f3]/40 shadow-xs'
                        : 'bg-[#f4f4f2] hover:bg-[#e8e8e6]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      {isToday ? (
                        <span className="text-[9px] font-sora font-bold uppercase text-[#52606c] tracking-wider">
                          Today
                        </span>
                      ) : (
                        <span></span>
                      )}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-sora text-xs font-semibold ${
                          isToday ? 'bg-[#151618] text-white' : 'text-[#151618]'
                        }`}
                      >
                        {dayNum}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 overflow-hidden">
                      {dayEvents.map((evt) => (
                        <div
                          key={evt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEventId(evt.id);
                            setRightPanelOpen(true);
                          }}
                          className={`px-2 py-0.5 rounded-[8px] font-sora text-[10px] font-medium truncate flex items-center justify-between ${
                            evt.category === 'Academics'
                              ? 'bg-[#E3D3E8] text-[#4A2859]'
                              : evt.category === 'Toastmasters'
                              ? 'bg-[#C9D8E6] text-[#1F4360]'
                              : evt.category === 'Career'
                              ? 'bg-[#F7D774] text-[#5C4A00]'
                              : evt.category === 'Creative'
                              ? 'bg-[#F4C9A8] text-[#5C3010]'
                              : evt.category === 'Habits'
                              ? 'bg-[#CFE5D2] text-[#21522A]'
                              : 'bg-[#EAEAEA] text-[#404040]'
                          }`}
                        >
                          <span className="truncate">{evt.title}</span>
                          {evt.synced && (
                            <span className="material-symbols-outlined text-[10px] shrink-0 ml-0.5">sync</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Next month day */}
              <div className="min-h-[102px] p-2 bg-[#f4f4f2]/40 rounded-2xl flex flex-col opacity-40">
                <span className="text-right font-sora text-xs text-[#77777b]">1</span>
              </div>
            </div>
          </div>

          {/* Compact Month Summary / Sync Footer */}
          <div className="mt-5 pt-4 border-t border-black/5 flex flex-wrap items-center justify-between font-sora text-xs text-[#52606c] gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4E9F6B]"></span>
                <span>VTOP API Connected</span>
              </span>
              <span className="text-[#c7c6ca]">•</span>
              <span>Google Calendar 2-Way Sync Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-outfit text-xs">Export ICS</span>
              <button
                onClick={() => alert('ICS calendar feed exported successfully.')}
                className="p-1 rounded-full hover:bg-[#eeeeec] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: CONTEXTUAL EVENT DETAIL PANEL */}
        {rightPanelOpen && (
          <div className="xl:col-span-4 2xl:col-span-3 bg-[#f4f4f2] rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            {/* Header: Title & Badges */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#E3D3E8] text-[#4A2859] font-sora text-[11px] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">school</span>
                  {selectedEvent.category} • Major Event
                </span>
                <button
                  onClick={() => setRightPanelOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-[#52606c] transition-colors cursor-pointer"
                  title="Close Panel"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <h2 className="font-outfit text-xl font-bold text-[#151618] tracking-tight">
                {selectedEvent.title}
              </h2>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-2 pt-1">
              <button
                className="w-10 h-10 rounded-full bg-[#F7D774] flex items-center justify-center text-[#151618] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Pin Priority"
              >
                <span className="material-symbols-outlined text-[18px]">star</span>
              </button>
              <button
                className="w-10 h-10 rounded-full bg-[#E3D3E8] flex items-center justify-center text-[#151618] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Reminders Active"
              >
                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
              </button>
              <button
                className="w-10 h-10 rounded-full bg-[#C9D8E6] flex items-center justify-center text-[#151618] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Link to Project"
              >
                <span className="material-symbols-outlined text-[18px]">link</span>
              </button>
              <div className="flex-1 flex justify-end">
                <span className="px-3 py-1 rounded-full bg-white font-sora text-xs font-semibold text-[#151618] shadow-xs">
                  {selectedEvent.code || 'CSE3001'}
                </span>
              </div>
            </div>

            {/* SECTION 1: Details Well */}
            <div className="bg-white p-4 rounded-2xl flex flex-col gap-3 shadow-xs">
              <span className="font-sora text-[10px] text-[#77777b] tracking-wider uppercase font-semibold">
                Event Details
              </span>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#77777b] mt-0.5">calendar_month</span>
                <div className="flex flex-col">
                  <span className="font-outfit text-xs font-semibold text-[#151618]">
                    Wednesday, {selectedEvent.day} October 2026
                  </span>
                  <span className="font-outfit text-[11px] text-[#77777b]">
                    Continuous Assessment Test 1
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#77777b] mt-0.5">schedule</span>
                <div className="flex flex-col">
                  <span className="font-outfit text-xs font-semibold text-[#151618]">
                    {selectedEvent.time || '9:30 AM – 11:00 AM'}
                  </span>
                  <span className="font-outfit text-[11px] text-[#77777b]">
                    90 minutes • Mandatory attendance
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#77777b] mt-0.5">location_on</span>
                <div className="flex flex-col">
                  <span className="font-outfit text-xs font-semibold text-[#151618]">
                    {selectedEvent.venue || 'AB3-401 • Technology Hall'}
                  </span>
                  <span className="font-outfit text-[11px] text-[#77777b]">
                    {selectedEvent.location || 'Seat 42B • Hall Ticket issued'}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2: Source & Sync */}
            <div className="bg-white p-4 rounded-2xl flex flex-col gap-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-sora text-[10px] text-[#77777b] tracking-wider uppercase font-semibold">
                  Source &amp; Sync
                </span>
                <span className="flex items-center gap-1 text-[11px] font-sora text-[#4E9F6B] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-outfit text-xs text-[#151618] font-medium">
                  VTOP Academics • Production
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#52606c]">sync</span>
              </div>
              <span className="font-outfit text-[10px] text-[#77777b]">Last synced 15 Oct, 6:40 PM</span>
            </div>

            {/* SECTION 3: Linked Tasks */}
            <div className="bg-white p-4 rounded-2xl flex flex-col gap-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-sora text-[10px] text-[#77777b] tracking-wider uppercase font-semibold">
                  Linked Tasks ({linkedTasks.filter((t) => t.done).length}/{linkedTasks.length})
                </span>
                <span className="font-sora text-[11px] text-[#151618] font-bold">
                  {Math.round((linkedTasks.filter((t) => t.done).length / linkedTasks.length) * 100)}%
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {linkedTasks.map((t) => (
                  <label key={t.id} className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleLinkedTask(t.id)}
                      className="mt-0.5 w-4 h-4 rounded accent-[#151618]"
                    />
                    <span
                      className={`font-outfit text-xs select-none ${
                        t.done ? 'text-[#77777b] line-through' : 'text-[#151618]'
                      }`}
                    >
                      {t.text}
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={onOpenQuickAdd}
                className="text-left font-sora text-xs text-[#52606c] hover:text-[#151618] pt-1 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span>Add linked task</span>
              </button>
            </div>

            {/* SECTION 4: Reminders */}
            <div className="bg-white p-4 rounded-2xl flex flex-col gap-2.5 shadow-xs">
              <span className="font-sora text-[10px] text-[#77777b] tracking-wider uppercase font-semibold">
                Active Reminders
              </span>
              <div className="flex flex-wrap gap-1.5">
                {reminders.map((rem, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-[#f4f4f2] flex items-center gap-1.5 font-sora text-[10px] text-[#151618]"
                  >
                    <span>{rem}</span>
                    <button
                      onClick={() => removeReminder(idx)}
                      className="hover:text-[#ba1a1a] flex items-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addReminder}
                className="w-fit px-3 py-1 rounded-full bg-[#e8e8e6] hover:bg-[#dadad8] text-[#151618] font-sora text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[13px]">add_alarm</span>
                <span>Add reminder</span>
              </button>
            </div>

            {/* BOTTOM ACTIONS */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onOpenQuickAdd}
                className="flex-1 py-2 rounded-full bg-white text-[#151618] hover:bg-[#eeeeec] font-sora text-xs font-semibold shadow-xs transition-all text-center cursor-pointer"
              >
                Edit Event
              </button>
              <button
                onClick={() => alert('Delete event action simulated.')}
                className="flex-1 py-2 rounded-full bg-[#ffdad6] text-[#ba1a1a] hover:opacity-90 font-sora text-xs font-semibold transition-all text-center cursor-pointer"
              >
                Delete
              </button>
            </div>
            <p className="text-center font-outfit text-[10px] text-[#77777b]">
              Delete requires confirmation • synced items will unbind
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
