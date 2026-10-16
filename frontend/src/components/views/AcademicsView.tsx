import React, { useState } from 'react';
import { AssessmentItem, NavTabId } from '../../types';

interface AcademicsViewProps {
  onOpenQuickAdd: () => void;
  onSelectTab: (tab: NavTabId) => void;
}

interface CourseItem {
  id: string;
  code: string;
  name: string;
  slot: string;
  faculty: string;
  attended: number;
  total: number;
  percentage: number;
  target: number;
  status: 'Safe' | 'Warning' | 'Critical';
  credits: number;
  type: 'Theory' | 'Lab' | 'Embedded';
}

const INITIAL_COURSES: CourseItem[] = [
  {
    id: 'c-1',
    code: 'CSE3002',
    name: 'Computer Networks',
    slot: 'B1 + TB1',
    faculty: 'Dr. K. Ramanathan',
    attended: 29,
    total: 39,
    percentage: 74.3,
    target: 75,
    status: 'Warning',
    credits: 4,
    type: 'Embedded',
  },
  {
    id: 'c-2',
    code: 'CSE3001',
    name: 'Software Engineering',
    slot: 'A1 + TA1',
    faculty: 'Prof. Ananya Sen',
    attended: 34,
    total: 38,
    percentage: 89.4,
    target: 75,
    status: 'Safe',
    credits: 4,
    type: 'Theory',
  },
  {
    id: 'c-3',
    code: 'CSE3003',
    name: 'Operating Systems',
    slot: 'C1 + TC1',
    faculty: 'Dr. V. Chandran',
    attended: 31,
    total: 36,
    percentage: 86.1,
    target: 75,
    status: 'Safe',
    credits: 4,
    type: 'Embedded',
  },
  {
    id: 'c-4',
    code: 'CSE3005',
    name: 'Design & Analysis of Algorithms',
    slot: 'D1 + TD1',
    faculty: 'Dr. S. Priya',
    attended: 32,
    total: 37,
    percentage: 86.4,
    target: 75,
    status: 'Safe',
    credits: 4,
    type: 'Theory',
  },
  {
    id: 'c-5',
    code: 'CSE3006',
    name: 'Database Management Systems',
    slot: 'E1 + TE1',
    faculty: 'Prof. M. Karthik',
    attended: 28,
    total: 35,
    percentage: 80.0,
    target: 75,
    status: 'Safe',
    credits: 4,
    type: 'Embedded',
  },
  {
    id: 'c-6',
    code: 'ENG2001',
    name: 'Technical Writing & Soft Skills',
    slot: 'F1',
    faculty: 'Dr. Rebecca Thomas',
    attended: 18,
    total: 20,
    percentage: 90.0,
    target: 75,
    status: 'Safe',
    credits: 2,
    type: 'Theory',
  },
  {
    id: 'c-7',
    code: 'CSE3002L',
    name: 'Computer Networks Lab',
    slot: 'L31+L32',
    faculty: 'Dr. K. Ramanathan',
    attended: 11,
    total: 12,
    percentage: 91.6,
    target: 75,
    status: 'Safe',
    credits: 1.5,
    type: 'Lab',
  },
];

export const AcademicsView: React.FC<AcademicsViewProps> = ({ onOpenQuickAdd, onSelectTab }) => {
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'assessments' | 'timetable' | 'calculator'>('overview');
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Wed');
  const [vtopSyncing, setVtopSyncing] = useState(false);
  const [vtopLastSync, setVtopLastSync] = useState('2 hours ago');
  const [targetCGPA, setTargetCGPA] = useState('9.10');

  const handleSyncVTOP = () => {
    setVtopSyncing(true);
    setTimeout(() => {
      setVtopSyncing(false);
      setVtopLastSync('Just now');
    }, 1200);
  };

  const handleMarkAttendance = (id: string, present: boolean) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const newTotal = c.total + 1;
        const newAttended = present ? c.attended + 1 : c.attended;
        const newPercentage = Number(((newAttended / newTotal) * 100).toFixed(1));
        return {
          ...c,
          total: newTotal,
          attended: newAttended,
          percentage: newPercentage,
          status: newPercentage < 75 ? 'Warning' : 'Safe',
        };
      })
    );
  };

  const warningCourse = courses.find(c => c.percentage < 75);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#151618] tracking-tight font-outfit">Academics & VTOP</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d9e6e8] text-[#2c4046]">
              Semester 5 • Fall 2026
            </span>
          </div>
          <p className="text-[#57595b] text-sm mt-1">
            Real-time syllabus tracker, 75% attendance safeguard buffer, CAT/FAT assessment pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncVTOP}
            disabled={vtopSyncing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-[#151618] shadow-sm transition border border-white/40"
          >
            <span className={`material-symbols-outlined text-sm ${vtopSyncing ? 'animate-spin text-[#d97d43]' : 'text-[#3d8357]'}`}>
              {vtopSyncing ? 'progress_activity' : 'sync'}
            </span>
            <span>{vtopSyncing ? 'Syncing VTOP...' : `VTOP: ${vtopLastSync}`}</span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold shadow-md transition"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add Study Milestone</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Cumulative GPA</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe5d2] flex items-center justify-center text-[#1e4d23]">
              <span className="material-symbols-outlined text-base">school</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">8.92</div>
            <div className="text-xs text-[#3d8357] font-semibold mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              Top 7% of CSE Batch
            </div>
          </div>
        </div>

        <div className="bg-[#fceeed] rounded-2xl p-5 border border-red-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9e3b30]">Attendance Alert</span>
            <div className="w-8 h-8 rounded-lg bg-[#f7d6d3] flex items-center justify-center text-[#9e3b30]">
              <span className="material-symbols-outlined text-base">warning</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#9e3b30]">74.3%</div>
            <div className="text-xs text-[#701e16] font-semibold mt-1">
              CSE3002 Computer Networks • Must attend next 2
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Registered Credits</span>
            <div className="w-8 h-8 rounded-lg bg-[#e3d3e8] flex items-center justify-center text-[#552763]">
              <span className="material-symbols-outlined text-base">auto_stories</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">23.5 <span className="text-sm font-medium text-[#77777b]">/ 24 max</span></div>
            <div className="text-xs text-[#57595b] font-medium mt-1">
              6 Theory • 1 Lab • 0 Backlogs
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Next Exam</span>
            <div className="w-8 h-8 rounded-lg bg-[#f7d774] flex items-center justify-center text-[#694400]">
              <span className="material-symbols-outlined text-base">timer</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#151618]">CAT-1 SWE</div>
            <div className="text-xs text-[#694400] font-semibold mt-1">
              In 5 Days • Wed, 21 Oct, 9:30 AM
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-white/40 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">dashboard</span>
          Overview & Buffer
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'attendance'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">fact_check</span>
          Full Attendance Ledger
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'assessments'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">assignment</span>
          CAT / FAT Pipeline
        </button>
        <button
          onClick={() => setActiveTab('timetable')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'timetable'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">schedule</span>
          Weekly Slot Timetable
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">calculate</span>
          GPA & Margin Calculator
        </button>
      </div>

      {/* Main Content Areas */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Urgent Warning Banner */}
          {warningCourse && (
            <div className="bg-[#fceeed] border border-red-300 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-[#9e3b30] shrink-0">
                  <span className="material-symbols-outlined">crisis_alert</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#701e16]">
                      Attendance Risk: {warningCourse.name} ({warningCourse.code})
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#9e3b30] text-white">
                      CRITICAL 74.3%
                    </span>
                  </div>
                  <p className="text-xs text-[#8c352a] mt-1 leading-relaxed">
                    Threshold requirement is 75.00%. You have attended {warningCourse.attended} out of {warningCourse.total} sessions.
                    You <strong>cannot miss any upcoming classes</strong>. Attending the next 2 classes will elevate your score to <strong>75.6%</strong>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleMarkAttendance(warningCourse.id, true)}
                  className="px-4 py-2 rounded-xl bg-[#9e3b30] hover:bg-[#701e16] text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Mark Present for Today
                </button>
              </div>
            </div>
          )}

          {/* Grid with Attendance Snapshot & Upcoming Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#151618]">Course Attendance & Buffer Margins</h2>
                  <p className="text-xs text-[#77777b]">Dynamic calculation of how many classes you can afford to miss</p>
                </div>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="text-xs font-bold text-[#151618] hover:underline flex items-center gap-0.5"
                >
                  View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              <div className="space-y-3">
                {courses.map(c => {
                  // calculate margin: (attended - 0.75 * total) / 0.75
                  const canMiss = Math.max(0, Math.floor((c.attended - 0.75 * c.total) / 0.75));
                  const mustAttend = c.percentage < 75 ? Math.ceil((0.75 * c.total - c.attended) / 0.25) : 0;

                  return (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl border border-black/5 bg-[#f5f6f8] hover:bg-white transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                            c.percentage < 75
                              ? 'bg-red-100 text-red-700'
                              : c.percentage < 80
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {c.percentage}%
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#151618]">{c.name}</h4>
                            <span className="text-[10px] font-mono font-medium text-[#77777b]">{c.code}</span>
                          </div>
                          <div className="text-xs text-[#77777b] mt-0.5">
                            Slot: {c.slot} • {c.attended}/{c.total} attended • {c.faculty}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-right">
                          {c.percentage < 75 ? (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                              Attend next {mustAttend}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                              Safe to miss {canMiss} {canMiss === 1 ? 'class' : 'classes'}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleMarkAttendance(c.id, true)}
                          title="Quick mark present"
                          className="w-8 h-8 rounded-lg bg-white hover:bg-black hover:text-white border border-black/10 flex items-center justify-center text-[#151618] transition text-sm"
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick CAT-1 Checklist */}
            <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-[#151618]">CAT-1 Readiness</h3>
                    <p className="text-xs text-[#77777b]">Starts Wednesday, Oct 21</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#f7d774] text-[#694400]">
                    5 Days Left
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#fff8eb] border border-amber-200">
                  <div className="flex items-center justify-between font-bold text-xs text-[#694400]">
                    <span>CSE3001 Software Engineering</span>
                    <span>15% Weight</span>
                  </div>
                  <div className="text-[11px] text-[#855400] mt-1">
                    Syllabus: Modules 1 & 2 (Agile, Requirements, UML, Architecture Patterns).
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#694400]">Revision Progress:</span>
                    <span className="font-black text-[#694400]">65%</span>
                  </div>
                  <div className="w-full bg-amber-200/60 rounded-full h-2 mt-1">
                    <div className="bg-[#bfa01e] h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-black focus:ring-0" />
                    <span className="line-through text-[#77777b]">Review Class Diagram semantics</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-black focus:ring-0" />
                    <span className="line-through text-[#77777b]">Solve 2024 Fall Previous CAT-1 Papers</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 cursor-pointer">
                    <input type="checkbox" className="rounded text-black focus:ring-0" />
                    <span className="font-medium text-[#151618]">Memorize Design Pattern trade-offs</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 cursor-pointer">
                    <input type="checkbox" className="rounded text-black focus:ring-0" />
                    <span className="font-medium text-[#151618]">Formula sheet for Cyclomatic Complexity</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => onSelectTab('tasks-and-projects')}
                className="w-full py-2.5 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                Open Study Sprints in Projects
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5">
            <div>
              <h2 className="text-lg font-bold text-[#151618]">Detailed Course Attendance Ledger</h2>
              <p className="text-xs text-[#77777b]">
                Calculated strictly based on mandatory 75% norm. Log attendance directly or sync via VTOP crawler.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#57595b]">Auto-sync: Active (VTOP)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 text-[#77777b] uppercase font-bold text-[10px] tracking-wider">
                  <th className="pb-3 px-3">Course Code</th>
                  <th className="pb-3 px-3">Course Title</th>
                  <th className="pb-3 px-3">Slot</th>
                  <th className="pb-3 px-3">Faculty</th>
                  <th className="pb-3 px-3 text-center">Attended / Total</th>
                  <th className="pb-3 px-3 text-center">% Attendance</th>
                  <th className="pb-3 px-3 text-center">Safety Buffer</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {courses.map(c => {
                  const canMiss = Math.max(0, Math.floor((c.attended - 0.75 * c.total) / 0.75));
                  const mustAttend = c.percentage < 75 ? Math.ceil((0.75 * c.total - c.attended) / 0.25) : 0;

                  return (
                    <tr key={c.id} className="hover:bg-[#f5f6f8] transition">
                      <td className="py-3.5 px-3 font-mono font-bold text-[#151618]">{c.code}</td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-[#151618]">{c.name}</div>
                        <div className="text-[10px] text-[#77777b]">{c.type} • {c.credits} Credits</div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[#57595b]">{c.slot}</td>
                      <td className="py-3.5 px-3 text-[#57595b]">{c.faculty}</td>
                      <td className="py-3.5 px-3 text-center font-bold text-[#151618]">
                        {c.attended} / {c.total}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full font-black text-xs ${
                            c.percentage < 75
                              ? 'bg-red-100 text-red-700'
                              : c.percentage < 80
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {c.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {c.percentage < 75 ? (
                          <span className="text-red-600 font-bold">Must attend {mustAttend}</span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">Can miss {canMiss}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleMarkAttendance(c.id, true)}
                            className="px-2.5 py-1 rounded bg-[#cfe5d2] hover:bg-[#b5d6bb] text-[#1e4d23] font-bold text-[11px] transition"
                            title="Mark Attended"
                          >
                            + Present
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(c.id, false)}
                            className="px-2.5 py-1 rounded bg-[#fceeed] hover:bg-[#fad8d5] text-[#9e3b30] font-bold text-[11px] transition"
                            title="Mark Absent"
                          >
                            - Miss
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assessments Tab */}
      {activeTab === 'assessments' && (
        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <div>
              <h2 className="text-lg font-bold text-[#151618]">Continuous Assessment Test (CAT) & Evaluation Timeline</h2>
              <p className="text-xs text-[#77777b]">Weightage distribution and tentative exam slots</p>
            </div>
            <button
              onClick={onOpenQuickAdd}
              className="px-3 py-1.5 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold transition flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Assessment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border-2 border-[#bfa01e] bg-[#fffbf0] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#f7d774] text-[#694400]">
                  UPCOMING IN 5 DAYS
                </span>
                <span className="text-xs font-bold text-[#694400]">15% Weight</span>
              </div>
              <h3 className="font-black text-base text-[#151618]">CAT-1 Software Engineering</h3>
              <p className="text-xs text-[#57595b]">Date: Wednesday, 21 Oct 2026 • 9:30 AM</p>
              <div className="text-xs text-[#77777b]">Hall: AB3-401 • Max Marks: 50</div>
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-xs text-[#694400] font-bold">Preparation: 65%</span>
                <span className="text-xs text-[#151618] font-bold underline cursor-pointer">View Syllabus</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-black/10 bg-[#fbfbfa] space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#cfe5d2] text-[#1e4d23]">
                  COMPLETED
                </span>
                <span className="text-xs font-bold text-[#1e4d23]">10% Weight</span>
              </div>
              <h3 className="font-black text-base text-[#151618]">Quiz-1: Software Design</h3>
              <p className="text-xs text-[#57595b]">Completed on 12 Sep 2026</p>
              <div className="text-xs text-[#1e4d23] font-bold">Score: 18.5 / 20 (92.5%)</div>
              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs text-[#77777b]">
                <span>Evaluated</span>
                <span>Class Rank: 4 / 68</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-black/10 bg-[#fbfbfa] space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#e3d3e8] text-[#552763]">
                  UPCOMING
                </span>
                <span className="text-xs font-bold text-[#552763]">25% Weight</span>
              </div>
              <h3 className="font-black text-base text-[#151618]">Lab FAT: Networks & OS</h3>
              <p className="text-xs text-[#57595b]">Date: 04 Nov 2026 • 2:00 PM</p>
              <div className="text-xs text-[#77777b]">Lab Hall: SJT-312 • Max Marks: 50</div>
              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs text-[#77777b]">
                <span>Socket programming + Shell scripts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Tab */}
      {activeTab === 'timetable' && (
        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#151618]">Fall 2026 Slot Timetable</h2>
              <p className="text-xs text-[#77777b]">Select day to highlight current lecture and lab commitments</p>
            </div>
            <div className="flex items-center gap-1 bg-[#ebeff3] p-1 rounded-xl">
              {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const).map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedDay === day ? 'bg-[#151618] text-white shadow-sm' : 'text-[#57595b] hover:text-black'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#f5f6f8] border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-sm text-[#151618]">08:00 - 08:50 AM</span>
                <div>
                  <h4 className="font-bold text-sm text-[#151618]">CSE3002 • Computer Networks</h4>
                  <p className="text-xs text-[#77777b]">Slot B1 • Room SJT-504 • Dr. K. Ramanathan</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#cfe5d2] text-[#1e4d23]">Attended</span>
            </div>

            <div className="p-4 rounded-xl bg-[#f5f6f8] border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-sm text-[#151618]">10:00 - 11:30 AM</span>
                <div>
                  <h4 className="font-bold text-sm text-[#151618]">CSE3001 • Software Engineering</h4>
                  <p className="text-xs text-[#77777b]">Slot A1 • Room TT-201 • Prof. Ananya Sen</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f7d774] text-[#694400]">Next Up</span>
            </div>

            <div className="p-4 rounded-xl bg-[#f5f6f8] border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-sm text-[#151618]">02:00 - 04:00 PM</span>
                <div>
                  <h4 className="font-bold text-sm text-[#151618]">CSE3002L • Networks Lab</h4>
                  <p className="text-xs text-[#77777b]">Slot L31+L32 • SJT Lab 3 • Practical Demonstration</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#57595b] border border-black/10">Upcoming</span>
            </div>
          </div>
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#151618]">Target CGPA Simulator</h2>
            <p className="text-xs text-[#77777b]">Estimate the semester GPA needed to graduate with high distinction.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#57595b] block mb-1">Target CGPA (out of 10.0)</label>
                <input
                  type="text"
                  value={targetCGPA}
                  onChange={e => setTargetCGPA(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 text-sm font-bold bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#cfe5d2]/40 border border-[#b5d6bb] space-y-2">
                <div className="text-xs font-bold text-[#1e4d23]">Required GPA in Semester 5:</div>
                <div className="text-3xl font-black text-[#1e4d23]">9.28</div>
                <p className="text-[11px] text-[#2c5231]">
                  Requires minimum 5 'S' Grades (10 points) and 2 'A' Grades (9 points) across 23.5 credits.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#151618]">Bunk / Attendance Margin Estimator</h2>
            <p className="text-xs text-[#77777b]">Test scenarios: see what happens if you take leave on particular days.</p>

            <div className="p-4 rounded-xl bg-[#f8f9fa] border border-black/10 space-y-3">
              <div className="text-xs font-semibold text-[#57595b]">
                Rule: VIT University requires minimum 75.00% without rounding up. Any course below 75% debars the student from writing the FAT.
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Safe Courses (&gt;80%):</span>
                <span className="text-emerald-700">5 Courses</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Critical Courses (&lt;75%):</span>
                <span className="text-red-600">1 Course (CSE3002)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
