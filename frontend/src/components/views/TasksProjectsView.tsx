import React, { useState } from 'react';
import { ProjectItem, TaskItem, NavTabId } from '../../types';

interface TasksProjectsViewProps {
  tasks: TaskItem[];
  projects: ProjectItem[];
  onOpenQuickAdd: () => void;
  onSelectTab: (tab: NavTabId) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  isCloudConnected?: boolean;
  loadingCloudData?: boolean;
  cloudError?: string | null;
}

export const TasksProjectsView: React.FC<TasksProjectsViewProps> = ({
  tasks,
  projects,
  onOpenQuickAdd,
  onSelectTab,
  onToggleTask,
  onDeleteTask,
  isCloudConnected = false,
  loadingCloudData = false,
  cloudError = null,
}) => {
  const [activeTab, setActiveTab] = useState<'List' | 'Board' | 'Calendar' | 'Matrix' | 'Overdue'>('Board');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('p-1');

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const openTasksCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => !t.completed && t.status === 'Urgent').length;
  const dueThisWeekCount = tasks.filter((t) => !t.completed && t.status === 'Upcoming').length;

  const todoTasks = tasks.filter((t) => !t.completed && (t.status === 'Pending' || t.status === 'Upcoming'));
  const inProgressTasks = tasks.filter((t) => !t.completed && t.status === 'Preparing');
  const reviewTasks = tasks.filter((t) => !t.completed && (t.status === 'In review' || t.status === 'Urgent'));
  const doneTasks = tasks.filter((t) => t.completed || t.status === 'Done');

  const renderTaskCard = (task: TaskItem) => (
    <div
      key={task.id}
      className={`bg-white rounded-xl p-3.5 shadow-xs hover:shadow-md transition-shadow flex flex-col gap-2 relative group cursor-pointer ${
        task.completed ? 'opacity-80' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-0.5 rounded-full font-sora text-[9px] font-semibold ${
            task.category === 'Academics'
              ? 'bg-[#E3D3E8] text-[#151618]'
              : task.category === 'Career'
              ? 'bg-[#F7D774] text-[#151618]'
              : task.category === 'Toastmasters'
              ? 'bg-[#C9D8E6] text-[#151618]'
              : task.category === 'Creative'
              ? 'bg-[#F4C9A8] text-[#151618]'
              : 'bg-[#eeeeec] text-[#151618]'
          }`}
        >
          {task.category}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              task.status === 'Urgent'
                ? 'bg-[#ba1a1a]'
                : task.priorityGroup === 'Must Do'
                ? 'bg-[#E8923A]'
                : 'bg-[#4E9F6B]'
            }`}
            title={task.status}
          ></span>
          {onDeleteTask && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600 transition-opacity text-[#77777b] cursor-pointer"
              title="Delete task"
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
            </button>
          )}
        </div>
      </div>
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 rounded border-gray-300 cursor-pointer accent-[#151618]"
        />
        <p
          className={`font-outfit text-xs font-semibold leading-snug flex-1 ${
            task.completed ? 'line-through text-[#52606c]' : 'text-[#151618]'
          }`}
        >
          {task.title}
        </p>
      </div>
      <div className="flex items-center justify-between text-[#52606c] font-outfit text-[11px] pt-1 border-t border-black/5">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">calendar_today</span>
          <span>{task.due}</span>
        </div>
        <div className="flex items-center gap-2">
          {task.duration && <span>{task.duration}</span>}
          {task.source && (
            <span className="px-1.5 py-0.5 rounded bg-[#f4f4f2] text-[9px] font-sora font-semibold truncate max-w-[80px]">
              {task.source}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Navigation & Segmented View Controller */}
      <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-outfit text-2xl lg:text-3xl font-semibold text-[#151618] tracking-tight">
              Tasks &amp; Projects
            </h1>
            {isCloudConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d5e4f3] text-[#0f1d27] text-[10px] font-sora font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"></span>
                Supabase Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fcedd2] text-[#78350f] text-[10px] font-sora font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span>
                Guest Demo Mode
              </span>
            )}
          </div>
          <p className="font-outfit text-xs text-[#52606c] mt-0.5">
            {openTasksCount} active tasks • {projects.length} projects tracked • {isCloudConnected ? 'Persisted in Supabase Cloud' : 'Using Local Mock Data'}
          </p>
          {cloudError && (
            <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-outfit">
              {cloudError}
            </div>
          )}
        </div>

        {/* Segmented View Filter Pills and Quick Add */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-[#eeeeec] rounded-full">
            {(['List', 'Board', 'Calendar', 'Matrix', 'Overdue'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveTab(view)}
                className={`px-3.5 py-1.5 rounded-full font-sora text-xs transition-all cursor-pointer ${
                  activeTab === view
                    ? 'bg-[#151618] text-white shadow-xs font-semibold'
                    : 'text-[#52606c] hover:text-[#151618]'
                }`}
              >
                {view === 'Overdue' ? (
                  <span className="flex items-center gap-1.5">
                    <span>Overdue</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                  </span>
                ) : (
                  view
                )}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenQuickAdd}
            className="px-5 py-2 rounded-full bg-[#F7D774] text-[#151618] font-sora text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>New Task</span>
          </button>
        </div>
      </section>

      {/* Row 1: Three Soft Pastel Highlight Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat 1: Open Tasks (Lilac) */}
        <div className="bg-[#E3D3E8] rounded-2xl p-5 flex items-center justify-between shadow-sm min-h-[96px] relative overflow-hidden">
          <div className="flex flex-col justify-center">
            <span className="font-sora text-[10px] text-[#151618]/70 font-semibold uppercase tracking-wider">
              Open Tasks
            </span>
            <span className="font-outfit text-3xl font-bold text-[#151618] leading-none mt-1">{openTasksCount}</span>
          </div>
          <button
            onClick={() => setActiveTab('Board')}
            className="px-4 py-1.5 rounded-full bg-white text-[#151618] font-sora text-[11px] font-semibold shadow-xs hover:bg-white/80 transition-all cursor-pointer"
          >
            View All →
          </button>
          <div className="absolute -right-4 -bottom-6 w-20 h-20 rounded-full bg-white/20 pointer-events-none"></div>
        </div>

        {/* Stat 2: Due This Week (Powder Blue) */}
        <div className="bg-[#C9D8E6] rounded-2xl p-5 flex items-center justify-between shadow-sm min-h-[96px] relative overflow-hidden">
          <div className="flex flex-col justify-center">
            <span className="font-sora text-[10px] text-[#151618]/70 font-semibold uppercase tracking-wider">
              Due This Week
            </span>
            <span className="font-outfit text-3xl font-bold text-[#151618] leading-none mt-1">{dueThisWeekCount}</span>
          </div>
          <button
            onClick={() => onSelectTab('calendar')}
            className="px-4 py-1.5 rounded-full bg-white text-[#151618] font-sora text-[11px] font-semibold shadow-xs hover:bg-white/80 transition-all cursor-pointer"
          >
            Schedule →
          </button>
          <div className="absolute -right-4 -bottom-6 w-20 h-20 rounded-full bg-white/20 pointer-events-none"></div>
        </div>

        {/* Stat 3: Overdue (Warm Yellow) */}
        <div className="bg-[#F7D774] rounded-2xl p-5 flex items-center justify-between shadow-sm min-h-[96px] relative overflow-hidden">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="font-sora text-[10px] text-[#151618]/80 font-semibold uppercase tracking-wider">
                Overdue
              </span>
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            </div>
            <span className="font-outfit text-3xl font-bold text-[#ba1a1a] leading-none mt-1">{overdueCount}</span>
          </div>
          <button
            onClick={() => setActiveTab('Overdue')}
            className="px-4 py-1.5 rounded-full bg-white text-[#151618] font-sora text-[11px] font-semibold shadow-xs hover:bg-white/80 transition-all cursor-pointer"
          >
            Review →
          </button>
          <div className="absolute -right-4 -bottom-6 w-20 h-20 rounded-full bg-white/20 pointer-events-none"></div>
        </div>
      </section>

      {/* Main Canvas Bento Split: Kanban & Projects on Left, Inspector on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Primary Work Surface (Cols 8) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Kanban Board Card */}
          <section className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            {/* Board Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-black/5">
              <div className="flex items-center gap-2">
                <h2 className="font-outfit text-lg font-semibold text-[#151618]">Task Board</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#eeeeec] text-[#52606c] font-sora text-[10px] font-medium">
                  Active Sprint
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#52606c] font-outfit text-xs">
                <div className="flex items-center gap-1 bg-[#f4f4f2] px-3 py-1 rounded-full cursor-pointer hover:bg-[#e8e8e6]">
                  <span>Sort: Priority</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_drop_down</span>
                </div>
                <div className="flex items-center gap-1 bg-[#f4f4f2] px-3 py-1 rounded-full cursor-pointer hover:bg-[#e8e8e6]">
                  <span>Filter: Project</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_drop_down</span>
                </div>
                <button
                  onClick={onOpenQuickAdd}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-[#f4f4f2] hover:bg-[#e8e8e6] text-[#151618] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                </button>
              </div>
            </div>

            {/* Kanban 4 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Column 1: To Do */}
              <div className="bg-[#f4f4f2] rounded-2xl p-3 flex flex-col gap-3 min-h-[400px]">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-sora text-xs text-[#151618] font-bold">To Do</span>
                    <span className="w-5 h-5 rounded-full bg-[#e8e8e6] flex items-center justify-center text-[10px] font-sora font-semibold text-[#52606c]">
                      {todoTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={onOpenQuickAdd}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#e8e8e6] text-[#52606c] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>

                {todoTasks.length > 0 ? (
                  todoTasks.map(renderTaskCard)
                ) : (
                  <div className="rounded-xl p-4 border border-dashed border-[#c7c6ca]/60 text-center text-xs font-outfit text-[#52606c]">
                    No tasks to do
                  </div>
                )}
              </div>

              {/* Column 2: In Progress */}
              <div className="bg-[#f4f4f2] rounded-2xl p-3 flex flex-col gap-3 min-h-[400px]">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-sora text-xs text-[#151618] font-bold">In Progress</span>
                    <span className="w-5 h-5 rounded-full bg-[#e8e8e6] flex items-center justify-center text-[10px] font-sora font-semibold text-[#52606c]">
                      {inProgressTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={onOpenQuickAdd}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#e8e8e6] text-[#52606c] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>

                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map(renderTaskCard)
                ) : (
                  <div className="rounded-xl p-4 border border-dashed border-[#c7c6ca]/60 text-center text-xs font-outfit text-[#52606c]">
                    No tasks in progress
                  </div>
                )}
              </div>

              {/* Column 3: Review */}
              <div className="bg-[#f4f4f2] rounded-2xl p-3 flex flex-col gap-3 min-h-[400px]">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-sora text-xs text-[#151618] font-bold">Review</span>
                    <span className="w-5 h-5 rounded-full bg-[#e8e8e6] flex items-center justify-center text-[10px] font-sora font-semibold text-[#52606c]">
                      {reviewTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={onOpenQuickAdd}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#e8e8e6] text-[#52606c] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>

                {reviewTasks.length > 0 ? (
                  reviewTasks.map(renderTaskCard)
                ) : (
                  <div className="rounded-xl p-4 border border-dashed border-[#c7c6ca]/60 text-center text-xs font-outfit text-[#52606c]">
                    No tasks under review
                  </div>
                )}
              </div>

              {/* Column 4: Done */}
              <div className="bg-[#f4f4f2] rounded-2xl p-3 flex flex-col gap-3 min-h-[400px]">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-sora text-xs text-[#151618] font-bold">Done</span>
                    <span className="w-5 h-5 rounded-full bg-[#e8e8e6] flex items-center justify-center text-[10px] font-sora font-semibold text-[#52606c]">
                      {doneTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={onOpenQuickAdd}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#e8e8e6] text-[#52606c] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>

                {doneTasks.length > 0 && doneTasks.map(renderTaskCard)}

                {/* Drop Zone Ghost Card */}
                <div className="rounded-xl p-4 border-2 border-dashed border-[#c7c6ca]/50 flex items-center justify-center text-[#52606c]/60 font-sora text-xs text-center">
                  {doneTasks.length === 0 ? 'No completed tasks yet' : 'Completed tasks'}
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section: Floating Pill Rows */}
          <section className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-outfit text-lg font-semibold text-[#151618]">Active Projects</h2>
                <p className="font-outfit text-xs text-[#52606c]">
                  {projects.length} active engineering &amp; personal ventures
                </p>
              </div>
              <button
                onClick={onOpenQuickAdd}
                className="px-4 py-1.5 rounded-full bg-[#f4f4f2] text-[#151618] font-sora text-xs font-semibold hover:bg-[#e8e8e6] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span>New Project</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 px-4 rounded-2xl transition-all gap-3 cursor-pointer ${
                    selectedProjectId === proj.id
                      ? 'bg-[#f4f4f2] ring-2 ring-[#151618] shadow-sm'
                      : 'bg-[#f4f4f2]/70 hover:bg-[#f4f4f2]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-sora text-[10px] font-semibold ${
                        proj.category === 'Academics'
                          ? 'bg-[#E3D3E8] text-[#151618]'
                          : proj.category === 'Creative'
                          ? 'bg-[#F4C9A8] text-[#151618]'
                          : 'bg-[#F7D774] text-[#151618]'
                      }`}
                    >
                      {proj.category}
                    </span>
                    <span className="font-outfit text-sm font-semibold text-[#151618] truncate">
                      {proj.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 min-w-[120px]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        proj.status === 'Active Build'
                          ? 'bg-[#4E9F6B]'
                          : proj.status === 'In Progress'
                          ? 'bg-[#E8923A]'
                          : 'bg-[#77777b]'
                      }`}
                    />
                    <span className="font-outfit text-xs text-[#52606c]">{proj.status}</span>
                  </div>

                  <div className="flex-1 max-w-[220px] flex items-center gap-2">
                    <div className="w-full bg-[#e8e8e6] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#2A2A2C] h-full rounded-full transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                    <span className="font-sora text-[11px] text-[#52606c] font-semibold">
                      {proj.progress}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 min-w-[120px]">
                    <span className="font-outfit text-xs text-[#52606c]">{proj.dueDate}</span>
                    <span className="material-symbols-outlined text-[18px] text-[#77777b]">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Contextual Inspector Panel */}
        <aside className="xl:col-span-4 bg-[#eeeeec] rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          {/* Project Detail Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#E3D3E8] flex items-center justify-center shrink-0 shadow-sm text-[#151618]">
                <span className="material-symbols-outlined text-[28px]">database</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-outfit text-xl font-bold text-[#151618]">
                    {selectedProject?.name || 'No Project Selected'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#151618] font-sora text-[10px] font-bold">
                    {selectedProject?.version || 'v1.0'}
                  </span>
                </div>
                <p className="font-outfit text-xs text-[#52606c]">
                  {selectedProject?.description || 'Select or create a project to view details'}
                </p>
              </div>
            </div>

            {/* 3 Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                className="w-11 h-11 rounded-full bg-[#F7D774] text-[#151618] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Pin Priority"
              >
                <span className="material-symbols-outlined text-[20px]">star</span>
              </button>
              <button
                onClick={onOpenQuickAdd}
                className="w-11 h-11 rounded-full bg-[#E3D3E8] text-[#151618] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Add Task"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
              <button
                className="w-11 h-11 rounded-full bg-[#C9D8E6] text-[#151618] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Project Notes"
              >
                <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
              </button>
              <div className="ml-auto text-[#52606c] font-sora text-[11px] font-semibold bg-white px-3 py-1 rounded-full shadow-xs">
                Active Focus
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-black/5"></div>

          {/* Milestones Timeline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-outfit text-sm font-semibold text-[#151618]">Milestones</h4>
              <span className="font-sora text-[10px] text-[#52606c]">2 of 4 reached</span>
            </div>
            <div className="flex flex-col gap-3 relative pl-4 border-l-2 border-[#c7c6ca]/50 ml-2 my-1">
              <div className="relative flex flex-col">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#4E9F6B]"></span>
                <span className="font-sora text-[10px] text-[#52606c]">Oct 10</span>
                <p className="font-outfit text-xs font-semibold text-[#151618]">Schema Architecture approved</p>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#E8923A]"></span>
                <span className="font-sora text-[10px] text-[#E8923A] font-bold">Oct 18 • Current</span>
                <p className="font-outfit text-xs font-semibold text-[#151618]">Supabase DB migrations &amp; auth</p>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#c7c6ca]"></span>
                <span className="font-sora text-[10px] text-[#52606c]">Oct 24</span>
                <p className="font-outfit text-xs text-[#52606c]">API Gateway integration</p>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#c7c6ca]"></span>
                <span className="font-sora text-[10px] text-[#52606c]">Oct 30</span>
                <p className="font-outfit text-xs text-[#52606c]">Alpha Test on Campus</p>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-black/5"></div>

          {/* Recent Activity */}
          <div className="flex flex-col gap-3">
            <h4 className="font-outfit text-sm font-semibold text-[#151618]">Recent Activity</h4>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#52606c] shrink-0 mt-0.5 shadow-xs">
                  <span className="material-symbols-outlined text-[14px]">lock_reset</span>
                </span>
                <div className="flex flex-col">
                  <p className="font-outfit text-xs text-[#151618] font-medium">
                    Gowrish updated table permissions
                  </p>
                  <span className="font-sora text-[10px] text-[#77777b]">10:45 AM • Supabase RLS</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#52606c] shrink-0 mt-0.5 shadow-xs">
                  <span className="material-symbols-outlined text-[14px]">checklist</span>
                </span>
                <div className="flex flex-col">
                  <p className="font-outfit text-xs text-[#151618] font-medium">Added 3 subtasks to API route</p>
                  <span className="font-sora text-[10px] text-[#77777b]">Yesterday • Sprint backlog</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-black/5"></div>

          {/* Scrubber Progress & Workspace Launcher */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-outfit text-xs font-semibold text-[#151618]">Sprint Progress</span>
                <span className="font-sora text-[10px] text-[#52606c]">68% Complete</span>
              </div>
              <div className="relative w-full h-6 bg-white rounded-full flex items-center px-2 shadow-inner overflow-hidden">
                <div className="h-2.5 bg-[#E3D3E8] rounded-full z-10" style={{ width: '68%' }}></div>
                <div
                  className="absolute z-20 w-2.5 h-4 bg-[#D9534F] rounded-full shadow-md"
                  style={{ left: 'calc(68% - 5px)' }}
                ></div>
              </div>
              <p className="font-outfit text-[11px] text-[#77777b] text-center">14 of 21 tasks resolved</p>
            </div>

            <button
              onClick={() => alert(`Opening ${selectedProject?.name || 'Selected'} Project Workspace...`)}
              className="w-full py-3 rounded-full bg-[#151618] text-white font-sora text-xs font-semibold shadow-sm hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Project Workspace</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
