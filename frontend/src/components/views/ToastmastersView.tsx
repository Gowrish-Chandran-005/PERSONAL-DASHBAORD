import React, { useState, useEffect } from 'react';
import { ToastmastersSession, NavTabId } from '../../types';
import { INITIAL_TOASTMASTERS_SESSIONS } from '../../data/mockData';

interface ToastmastersViewProps {
  onOpenQuickAdd: () => void;
  onSelectTab: (tab: NavTabId) => void;
}

export const ToastmastersView: React.FC<ToastmastersViewProps> = ({ onOpenQuickAdd, onSelectTab }) => {
  const [sessions, setSessions] = useState<ToastmastersSession[]>(INITIAL_TOASTMASTERS_SESSIONS);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'sessions' | 'creatives' | 'roster' | 'timer'>('pipeline');
  
  // Table topics timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Resilience is built in the moments nobody sees.');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toastmasters lighting signal:
  // For 1-2 min Table Topics:
  // < 1:00 White/Grey
  // 1:00 - 1:29 Green
  // 1:30 - 1:59 Yellow / Amber
  // >= 2:00 Red
  const getTimerLight = (secs: number) => {
    if (secs < 60) return { color: 'bg-white text-[#151618]', label: 'Qualifying range starts at 1:00' };
    if (secs < 90) return { color: 'bg-[#cfe5d2] text-[#1e4d23]', label: 'GREEN (Minimum time reached)' };
    if (secs < 120) return { color: 'bg-[#f7d774] text-[#694400]', label: 'YELLOW (30 seconds remaining)' };
    return { color: 'bg-[#fceeed] text-[#9e3b30]', label: 'RED (Wrap up your thoughts now)' };
  };

  const timerLight = getTimerLight(timerSeconds);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#151618] tracking-tight font-outfit">Toastmasters VPPR Command</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d9e6e8] text-[#2c4046]">
              SOL Club #42
            </span>
          </div>
          <p className="text-[#57595b] text-sm mt-1">
            Brand integrity, session poster pipelines, social campaigns, and speaker coaching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('timer')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-[#151618] shadow-sm transition border border-white/40"
          >
            <span className="material-symbols-outlined text-sm text-[#bfa01e]">timer</span>
            <span>Impromptu Timer</span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151618] hover:bg-black text-white text-xs font-bold shadow-md transition"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New PR Asset</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Next Meeting</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe5d2] flex items-center justify-center text-[#1e4d23]">
              <span className="material-symbols-outlined text-base">event</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#151618]">Session #42</div>
            <div className="text-xs text-[#3d8357] font-semibold mt-1">
              Sat, Oct 18 • 5:00 PM • Tech Hall
            </div>
          </div>
        </div>

        <div className="bg-[#fff8eb] rounded-2xl p-5 border border-amber-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#694400]">Poster Release</span>
            <div className="w-8 h-8 rounded-lg bg-[#f7d774] flex items-center justify-center text-[#694400]">
              <span className="material-symbols-outlined text-base">palette</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#694400]">In Review</div>
            <div className="text-xs text-[#855400] font-semibold mt-1">
              Sign-off needed by 6:00 PM today
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Social Impressions</span>
            <div className="w-8 h-8 rounded-lg bg-[#e3d3e8] flex items-center justify-center text-[#552763]">
              <span className="material-symbols-outlined text-base">trending_up</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#151618]">3,840</div>
            <div className="text-xs text-[#3d8357] font-semibold mt-1">
              +18.4% WoW (Instagram & LinkedIn)
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77777b]">Agenda Readiness</span>
            <div className="w-8 h-8 rounded-lg bg-[#cfe5d2] flex items-center justify-center text-[#1e4d23]">
              <span className="material-symbols-outlined text-base">how_to_reg</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#151618]">7 / 9 Roles</div>
            <div className="text-xs text-[#57595b] font-medium mt-1">
              Need Evaluator #2 & Grammarian
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
          Poster & Content Pipeline
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'sessions'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">groups</span>
          Upcoming Sessions
        </button>
        <button
          onClick={() => setActiveTab('creatives')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'creatives'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">photo_library</span>
          Published Assets
        </button>
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'roster'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">table_rows</span>
          Roster (Sheets Sync)
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'timer'
              ? 'bg-[#151618] text-white shadow-sm'
              : 'bg-white/60 hover:bg-white text-[#57595b]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">mic</span>
          Table Topics Light Box
        </button>
      </div>

      {/* Pipeline View */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#151618] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                In Concept / Draft (2)
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#f5f6f8] border border-black/5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Session #43 Teaser
                </span>
                <h4 className="font-bold text-sm text-[#151618]">The Art of Storytelling Story Carousel</h4>
                <p className="text-xs text-[#77777b]">Typography layout + speaker headshots</p>
                <div className="flex items-center justify-between text-xs text-[#57595b] pt-2 border-t border-black/5">
                  <span>Due: Oct 20</span>
                  <span className="font-bold">Gowrish</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f5f6f8] border border-black/5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                  Member Spotlight
                </span>
                <h4 className="font-bold text-sm text-[#151618]">Highlight: Best Table Topics Winner</h4>
                <p className="text-xs text-[#77777b]">Short video quote clip with subtitles</p>
                <div className="flex items-center justify-between text-xs text-[#57595b] pt-2 border-t border-black/5">
                  <span>Due: Oct 19</span>
                  <span className="font-bold">Creative Team</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#151618] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Review & Approvals (1)
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-[#fff8eb] border border-amber-200 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#694400] bg-[#f7d774] px-2 py-0.5 rounded">
                URGENT • Session #42 Hero
              </span>
              <h4 className="font-bold text-sm text-[#151618]">Master of Resilience Official Poster</h4>
              <p className="text-xs text-[#694400]">
                Resolution 1080x1350 • Needs President & VPE sign-off before mass release.
              </p>

              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/10 relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa40Gx6Y1ubQOOg2Zx5wkqe-E49qViDRc9AJurE2pfSiIgQQxOKIqdQaHgVLM4DdH1Dd9T7jrClzIxanG5ExQsRGIWg274XFKNoMSMQf1JqBHcNc5qlwlhoQ6JMo3STiPYSov1s1-TDAWTKRhTObtr_WFTk1MsGNLEk7UU7ciddIwaOILR4AJanikOBmnQxMpeKbb0p36_1zrilykJTlqR1udAQ9S7PHCzBGn-sRnBYm5NVHKqFfiNQA"
                  alt="Poster preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 py-1.5 rounded-lg bg-[#3d8357] hover:bg-[#1e4d23] text-white text-xs font-bold transition">
                  Approve & Broadcast
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-white border border-black/10 text-xs font-bold hover:bg-gray-50 transition">
                  Revise
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#151618] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Scheduled & Published (3)
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#f5f6f8] border border-black/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Published Today, 9:00 AM
                </span>
                <h4 className="font-bold text-sm text-[#151618]">WhatsApp Community Broadcast</h4>
                <p className="text-xs text-[#77777b]">Theme announcement & speaker call (142 opened)</p>
              </div>

              <div className="p-4 rounded-xl bg-[#f5f6f8] border border-black/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Scheduled for Oct 17, 6:00 PM
                </span>
                <h4 className="font-bold text-sm text-[#151618]">Instagram Carousel Countdown</h4>
                <p className="text-xs text-[#77777b]">3-slide story series highlighting key topics</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Impromptu Table Topics Light Box */}
      {activeTab === 'timer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-[#151618]">Official Table Topics Timer</h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#f5f6f8] text-[#57595b]">
                  Rules: 1:00 min min, 2:00 max (+30s grace)
                </span>
              </div>

              {/* Toastmasters Light indicator */}
              <div className={`p-6 rounded-2xl border transition-all text-center space-y-2 ${timerLight.color}`}>
                <div className="text-6xl font-black font-mono tracking-wider">
                  {formatTimer(timerSeconds)}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider">
                  {timerLight.label}
                </div>
              </div>

              {/* Topic Prompt Card */}
              <div className="mt-6 p-4 rounded-xl bg-[#f8f9fa] border border-black/5">
                <div className="text-[11px] font-bold uppercase text-[#77777b] mb-1">Random Table Topic</div>
                <p className="text-sm font-bold text-[#151618]">"{selectedTopic}"</p>
                <button
                  onClick={() => {
                    const topics = [
                      'Resilience is built in the moments nobody sees.',
                      'If you had 5 minutes of global attention, what would you say?',
                      'Failure is simply the cost of tuition for success.',
                      'What is a technology that changed the trajectory of human empathy?',
                      'Is comfort the enemy of high achievement?'
                    ];
                    const next = topics[Math.floor(Math.random() * topics.length)];
                    setSelectedTopic(next);
                  }}
                  className="mt-2 text-xs font-semibold text-[#151618] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Draw Another Topic
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                  isTimerRunning
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow'
                    : 'bg-[#151618] hover:bg-black text-white shadow-md'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {isTimerRunning ? 'pause' : 'play_arrow'}
                </span>
                {isTimerRunning ? 'Pause Timer' : 'Start Impromptu Speech'}
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="px-4 py-3 rounded-xl bg-white hover:bg-gray-100 border border-black/10 text-xs font-bold text-[#151618] transition"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white/60 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#151618]">Toastmasters Timing Guidelines</h3>
            <p className="text-xs text-[#57595b] leading-relaxed">
              As timer, signal with green, yellow, and red cards to help speakers manage time without disrupting their mental train of thought:
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#cfe5d2]/40 border border-[#cfe5d2] flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-[#1e4d23]"></span>
                <div>
                  <div className="font-bold text-xs text-[#1e4d23]">Green Light at 1 Minute</div>
                  <div className="text-[11px] text-[#2c5231]">The speech has met the minimum qualifying requirement.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f7d774]/40 border border-[#f7d774] flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-[#694400]"></span>
                <div>
                  <div className="font-bold text-xs text-[#694400]">Yellow Light at 1 Minute 30 Seconds</div>
                  <div className="text-[11px] text-[#855400]">30 seconds left to structure the conclusion and call to action.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#fceeed] border border-red-200 flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-[#9e3b30]"></span>
                <div>
                  <div className="font-bold text-xs text-[#9e3b30]">Red Light at 2 Minutes</div>
                  <div className="text-[11px] text-[#701e16]">Maximum time limit reached. 30 seconds disqualification buffer begins.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roster & Google Sheets sync tab */}
      {activeTab === 'roster' && (
        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <div>
              <h3 className="font-bold text-base text-[#151618]">Meeting Role Roster • Session #42</h3>
              <p className="text-xs text-[#77777b]">Two-way sync connected to official Club Google Sheet</p>
            </div>
            <span className="text-xs font-bold text-[#1e4d23] bg-[#cfe5d2] px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs">sync</span>
              Synced 3 min ago
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#f5f6f8] border border-black/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#151618]">Toastmaster of the Day (TMOD)</div>
                <div className="text-[11px] text-[#77777b]">Theme leader & host</div>
              </div>
              <span className="text-xs font-bold text-[#151618] bg-white px-3 py-1 rounded-lg border border-black/5">
                Kavya Sharma
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f5f6f8] border border-black/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#151618]">General Evaluator (GE)</div>
                <div className="text-[11px] text-[#77777b]">Session quality auditor</div>
              </div>
              <span className="text-xs font-bold text-[#151618] bg-white px-3 py-1 rounded-lg border border-black/5">
                Aditya Rao
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f5f6f8] border border-black/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#151618]">Table Topics Master (TTM)</div>
                <div className="text-[11px] text-[#77777b]">Impromptu session director</div>
              </div>
              <span className="text-xs font-bold text-[#151618] bg-white px-3 py-1 rounded-lg border border-black/5">
                Gowrish (You)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fff8eb] border border-amber-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#694400]">Evaluator #2 (VACANT)</div>
                <div className="text-[11px] text-[#855400]">Needs member confirmation</div>
              </div>
              <button className="text-xs font-bold text-[#694400] bg-[#f7d774] px-3 py-1 rounded-lg hover:bg-[#ebd065] transition">
                + Assign Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sessions list */}
      {(activeTab === 'sessions' || activeTab === 'creatives') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessions.map(s => (
            <div key={s.id} className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-[#d9e6e8] text-[#2c4046]">
                  Session #{s.number}
                </span>
                <span className="text-xs font-semibold text-[#57595b]">{s.date}</span>
              </div>
              <h3 className="font-bold text-base text-[#151618]">{s.title}</h3>
              <p className="text-xs text-[#57595b]">Theme: <span className="font-semibold">{s.theme}</span></p>
              <div className="text-xs text-[#77777b]">Venue: {s.venue}</div>
              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                <span>Roles: {s.rolesFilled} / {s.rolesTotal}</span>
                <span className="font-bold text-[#3d8357]">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
