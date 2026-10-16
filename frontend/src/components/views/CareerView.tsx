import React, { useState } from 'react';
import { InternshipApplication, SkillMastery, NavTabId } from '../../types';
import { INITIAL_INTERNSHIPS, INITIAL_SKILLS } from '../../data/mockData';

interface CareerViewProps {
  onOpenQuickAdd: () => void;
  onSelectTab: (tab: NavTabId) => void;
}

export const CareerView: React.FC<CareerViewProps> = ({ onOpenQuickAdd, onSelectTab }) => {
  const [internships, setInternships] = useState<InternshipApplication[]>(INITIAL_INTERNSHIPS);
  const [skills, setSkills] = useState<SkillMastery[]>(INITIAL_SKILLS);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'dsa' | 'system-design' | 'resumes'>('pipeline');
  const [filterRole, setFilterRole] = useState<'All' | 'SWE' | 'Data / ML' | 'Systems'>('All');

  const updateStatus = (id: string, newStatus: InternshipApplication['status']) => {
    setInternships(prev =>
      prev.map(app => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const columns: { label: string; status: InternshipApplication['status']; color: string }[] = [
    { label: 'Wishlist', status: 'Wishlist', color: 'bg-gray-100 text-gray-700' },
    { label: 'Preparing', status: 'Preparing', color: 'bg-amber-100 text-amber-800' },
    { label: 'Applied', status: 'Applied', color: 'bg-blue-100 text-blue-800' },
    { label: 'OA / Interview', status: 'OA / Interview', color: 'bg-purple-100 text-purple-800' },
    { label: 'Closed / Archived', status: 'Closed', color: 'bg-neutral-100 text-neutral-600' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#151618] tracking-tight font-outfit">Career & Learning</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d9e6e8] text-[#2c4046]">
              Fall 2026 Recruitment
            </span>
          </div>
          <p className="text-[#57595b] text-sm mt-1">
            Software engineering internship pipeline, interview roadmaps, LeetCode mastery, and ATS resumes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dsa')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-[#151618] shadow-sm transition border border-white/40"
          >
            <span className="material-symbols-outlined text-sm text-[#3d8357]">terminal</span>
            <span>DSA Tracker (80%)</span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold shadow-md transition"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add Target Role</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Active Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe5d2] flex items-center justify-center text-[#1e4d23]">
              <span className="material-symbols-outlined text-base">work</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">{internships.length} Companies</div>
            <div className="text-xs text-[#3d8357] font-semibold mt-1">
              Top Tier: Databricks, MSFT, OpenAI
            </div>
          </div>
        </div>

        <div className="bg-[#fff8eb] rounded-2xl p-5 border border-amber-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#694400]">Next Submission</span>
            <div className="w-8 h-8 rounded-lg bg-[#f7d774] flex items-center justify-center text-[#694400]">
              <span className="material-symbols-outlined text-base">event_note</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#694400]">Microsoft SWE</div>
            <div className="text-xs text-[#855400] font-semibold mt-1">
              Due Oct 24 • Resume v3 ready
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Interview / OA</span>
            <div className="w-8 h-8 rounded-lg bg-[#e3d3e8] flex items-center justify-center text-[#552763]">
              <span className="material-symbols-outlined text-base">psychology</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">OpenAI</div>
            <div className="text-xs text-[#552763] font-semibold mt-1">
              AI Infra Online Assessment (Oct 30)
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Coding Practice</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe5d2] flex items-center justify-center text-[#1e4d23]">
              <span className="material-symbols-outlined text-base">code</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#151618]">18d Streak</div>
            <div className="text-xs text-[#3d8357] font-semibold mt-1">
              342 LeetCode problems solved
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-white/40 pb-2">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'pipeline'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">view_kanban</span>
          Internship Kanban Pipeline
        </button>
        <button
          onClick={() => setActiveTab('dsa')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'dsa'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">terminal</span>
          DSA & LeetCode Roadmaps
        </button>
        <button
          onClick={() => setActiveTab('system-design')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'system-design'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">hub</span>
          System Design Architecture
        </button>
        <button
          onClick={() => setActiveTab('resumes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'resumes'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">description</span>
          Tailored Resumes (v3 - v4.2)
        </button>
      </div>

      {/* Pipeline View */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map(col => {
            const apps = internships.filter(a => a.status === col.status);
            return (
              <div key={col.status} className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-white/60 shadow-sm flex flex-col min-w-[240px]">
                <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-[#77777b]">{apps.length}</span>
                </div>

                <div className="space-y-3 flex-1">
                  {apps.map(app => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl bg-[#f5f6f8] border border-black/5 hover:border-black/20 hover:shadow-sm transition space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[#151618]">{app.company}</h4>
                        {app.priority && (
                          <span className="w-2 h-2 rounded-full bg-red-500" title="Top Priority Target"></span>
                        )}
                      </div>
                      <p className="text-xs text-[#57595b] line-clamp-2">{app.role}</p>

                      <div className="flex flex-wrap gap-1">
                        {app.tags.map(t => (
                          <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-black/5 text-[#57595b]">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-[#77777b]">
                        <span>Due: {app.deadline}</span>
                        <span className="font-semibold">{app.resumeVersion}</span>
                      </div>

                      {/* Quick stage mover */}
                      <div className="pt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        {col.status !== 'Wishlist' && (
                          <button
                            onClick={() => {
                              const order: InternshipApplication['status'][] = ['Wishlist', 'Preparing', 'Applied', 'OA / Interview', 'Closed'];
                              const currentIndex = order.indexOf(app.status);
                              if (currentIndex > 0) updateStatus(app.id, order[currentIndex - 1]);
                            }}
                            className="px-2 py-0.5 rounded bg-white text-[10px] font-bold border border-black/10 hover:bg-black hover:text-white"
                          >
                            ← Prev
                          </button>
                        )}
                        {col.status !== 'Closed' && (
                          <button
                            onClick={() => {
                              const order: InternshipApplication['status'][] = ['Wishlist', 'Preparing', 'Applied', 'OA / Interview', 'Closed'];
                              const currentIndex = order.indexOf(app.status);
                              if (currentIndex < order.length - 1) updateStatus(app.id, order[currentIndex + 1]);
                            }}
                            className="px-2 py-0.5 rounded bg-white text-[10px] font-bold border border-black/10 hover:bg-black hover:text-white"
                          >
                            Next →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {apps.length === 0 && (
                    <div className="py-8 text-center text-xs text-[#77777b]">
                      No applications in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DSA & Skills Tracker */}
      {activeTab === 'dsa' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div>
                <h3 className="font-bold text-base text-[#151618]">Technical Skills & Interview Roadmaps</h3>
                <p className="text-xs text-[#77777b]">Curated syllabus targeting Big Tech and high-growth infrastructure roles</p>
              </div>
              <span className="text-xs font-bold text-[#1e4d23] bg-[#cfe5d2] px-3 py-1 rounded-full">
                Overall: 71% Complete
              </span>
            </div>

            <div className="space-y-4">
              {skills.map(s => (
                <div key={s.id} className="p-3.5 rounded-xl bg-[#f5f6f8] border border-black/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#151618]">{s.name}</span>
                    <span className="text-xs font-black text-[#151618]">{s.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-black/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${s.progressPercentage}%`, backgroundColor: s.color }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#77777b]">
                    <span>{s.completedTopics} / {s.totalTopics} Core Patterns Mastered</span>
                    <span>{s.hoursSpent} Hours Logged</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-[#151618]">Today's High-Yield Problem</h3>
              <div className="p-4 rounded-xl bg-[#fff8eb] border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#694400] bg-[#f7d774] px-2 py-0.5 rounded">
                    LEETCODE HARD
                  </span>
                  <span className="text-xs text-[#694400] font-bold">#42 • Trapping Rain Water</span>
                </div>
                <p className="text-xs text-[#855400] leading-relaxed">
                  Focus on Two-Pointer O(1) space optimization and Monotonic Stack approach.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#694400] font-semibold">Frequency: 94% at MSFT & Meta</span>
                  <button className="px-3 py-1 rounded bg-[#151618] hover:bg-black text-white font-bold text-xs">
                    Solve
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-[#57595b]">Recent Submissions:</div>
                <div className="text-xs flex items-center justify-between p-2 rounded-lg bg-[#f5f6f8]">
                  <span>LRU Cache (Doubly Linked List + Map)</span>
                  <span className="text-emerald-700 font-bold">Accepted</span>
                </div>
                <div className="text-xs flex items-center justify-between p-2 rounded-lg bg-[#f5f6f8]">
                  <span>Course Schedule II (Topological Sort)</span>
                  <span className="text-emerald-700 font-bold">Accepted</span>
                </div>
                <div className="text-xs flex items-center justify-between p-2 rounded-lg bg-[#f5f6f8]">
                  <span>Word Ladder (Bi-directional BFS)</span>
                  <span className="text-emerald-700 font-bold">Accepted</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('tasks-and-projects')}
              className="w-full py-2.5 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">timer</span>
              Launch 45-min Timed Mock
            </button>
          </div>
        </div>
      )}

      {/* Resumes Tab */}
      {(activeTab === 'resumes' || activeTab === 'system-design') && (
        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#151618]">Tailored ATS Resumes & Portfolios</h3>
          <p className="text-xs text-[#77777b]">Targeted versions customized with high-impact system metrics</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#f5f6f8] border border-black/5 space-y-2">
              <span className="text-xs font-bold text-[#1e4d23] bg-[#cfe5d2] px-2 py-0.5 rounded">v4.1 • Systems & Cloud</span>
              <h4 className="font-bold text-sm text-[#151618]">Distributed & Backend Heavy</h4>
              <p className="text-xs text-[#77777b]">Used for: Google, Databricks, Microsoft</p>
              <div className="text-xs text-[#57595b]">Highlights: C++, Go, Kafka, Distributed Cache, 98% ATS score</div>
            </div>

            <div className="p-4 rounded-xl bg-[#f5f6f8] border border-black/5 space-y-2">
              <span className="text-xs font-bold text-[#552763] bg-[#e3d3e8] px-2 py-0.5 rounded">v4.2 • AI Systems</span>
              <h4 className="font-bold text-sm text-[#151618]">PyTorch & Model Infrastructure</h4>
              <p className="text-xs text-[#77777b]">Used for: OpenAI, Anthropic, Research labs</p>
              <div className="text-xs text-[#57595b]">Highlights: CUDA kernels, TensorRT, FlashAttention benchmarks</div>
            </div>

            <div className="p-4 rounded-xl bg-[#f5f6f8] border border-black/5 space-y-2">
              <span className="text-xs font-bold text-[#694400] bg-[#f7d774] px-2 py-0.5 rounded">v3.8 • Full Stack Core</span>
              <h4 className="font-bold text-sm text-[#151618]">React, TypeScript & WebGL</h4>
              <p className="text-xs text-[#77777b]">Used for: Stripe, Figma, High growth startups</p>
              <div className="text-xs text-[#57595b]">Highlights: Micro-frontends, WebGL rendering, GraphQL APIs</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
