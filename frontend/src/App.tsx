/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  NavTabId,
  TaskItem,
  CalendarEvent,
  ProjectItem,
  HabitItem,
  NotificationItem,
} from './types';
import {
  INITIAL_TASKS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_PROJECTS,
  INITIAL_HABITS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NotificationsFlyout } from './components/NotificationsFlyout';
import { QuickAddModal } from './components/QuickAddModal';
import { AuthModal } from './components/AuthModal';

import { OverviewView } from './components/views/OverviewView';
import { MyDayView } from './components/views/MyDayView';
import { CalendarView } from './components/views/CalendarView';
import { TasksProjectsView } from './components/views/TasksProjectsView';
import { AcademicsView } from './components/views/AcademicsView';
import { ToastmastersView } from './components/views/ToastmastersView';
import { CareerView } from './components/views/CareerView';
import { CreativeStudioView } from './components/views/CreativeStudioView';
import { HabitsView } from './components/views/HabitsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { SettingsView } from './components/views/SettingsView';
import { useAuth } from './context/AuthContext';
import { tasksService } from './services/tasksService';
import { projectsService } from './services/projectsService';

export default function App() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTabId>('overview');
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [isCloudLoading, setIsCloudLoading] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesktopWindowMode, setIsDesktopWindowMode] = useState(false);

  // Sync tasks and projects with Supabase when authenticated
  useEffect(() => {
    let isCancelled = false;

    async function loadCloudData() {
      if (!user) {
        // Guest demo mode: revert to clean mock data
        setTasks(INITIAL_TASKS);
        setProjects(INITIAL_PROJECTS);
        setCloudError(null);
        return;
      }

      setIsCloudLoading(true);
      setCloudError(null);

      try {
        const [tasksRes, projectsRes] = await Promise.all([
          tasksService.fetchTasks(),
          projectsService.fetchProjects(),
        ]);

        if (isCancelled) return;

        if (tasksRes.error || projectsRes.error) {
          const err = tasksRes.error || projectsRes.error;
          setCloudError(err?.message || 'Failed to load cloud data');
        } else {
          setTasks(tasksRes.data);
          setProjects(projectsRes.data);
        }
      } catch (err) {
        if (!isCancelled) {
          setCloudError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!isCancelled) {
          setIsCloudLoading(false);
        }
      }
    }

    loadCloudData();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  // Unread notification count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        if (e.key === 'Escape') {
          setQuickAddOpen(false);
          setNotificationsOpen(false);
        }
        return;
      }

      if (e.key === 'c' || e.key === 'C' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        setQuickAddOpen(true);
      } else if (e.key === 'Escape') {
        setQuickAddOpen(false);
        setNotificationsOpen(false);
      } else if (e.key === '1') {
        setCurrentTab('overview');
      } else if (e.key === '2') {
        setCurrentTab('my-day');
      } else if (e.key === '3') {
        setCurrentTab('calendar');
      } else if (e.key === '4') {
        setCurrentTab('tasks-and-projects');
      } else if (e.key === '5') {
        setCurrentTab('academics');
      } else if (e.key === '6') {
        setCurrentTab('toastmasters');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTask = async (id: string) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    const nextCompleted = !taskToToggle.completed;
    const nextStatus = nextCompleted ? 'Done' : 'Upcoming';

    // Optimistic UI update
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: nextCompleted, status: nextStatus } : t))
    );

    if (user) {
      const nextLifecycle = nextCompleted ? 'done' : 'inbox';
      const res = await tasksService.updateTask(id, { status: nextLifecycle });
      if (res.error) {
        // Rollback on error
        setTasks(prev => prev.map(t => (t.id === id ? taskToToggle : t)));
        setCloudError(`Failed to update task: ${res.error.message}`);
      } else {
        // Refresh projects to update derived progress
        const pRes = await projectsService.fetchProjects();
        if (pRes.data) setProjects(pRes.data);
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    const previousTasks = tasks;
    setTasks(prev => prev.filter(t => t.id !== id));

    if (user) {
      const res = await tasksService.deleteTask(id);
      if (res.error) {
        setTasks(previousTasks);
        setCloudError(`Failed to delete task: ${res.error.message}`);
      } else {
        const pRes = await projectsService.fetchProjects();
        if (pRes.data) setProjects(pRes.data);
      }
    }
  };

  const handleToggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        const newHistory = [...h.history];
        newHistory[4] = !newHistory[4]; // today is Friday index 4
        const completedDays = newHistory.filter(Boolean).length;
        const newRate = Math.round((completedDays / 7) * 100);
        return {
          ...h,
          history: newHistory,
          completionRate: newRate,
        };
      })
    );
  };

  const handleAddTask = async (newTask: Partial<TaskItem>) => {
    if (user) {
      setIsCloudLoading(true);
      setCloudError(null);
      const res = await tasksService.createTask({
        title: newTask.title || 'Untitled task',
        category: newTask.category,
        urgency: newTask.priorityGroup === 'Must Do' ? 'high' : 'medium',
        status: newTask.status === 'Urgent' ? 'in_progress' : 'inbox',
      });
      setIsCloudLoading(false);

      if (res.error) {
        setCloudError(`Failed to save task to cloud: ${res.error.message}`);
      } else if (res.data) {
        setTasks(prev => [res.data!, ...prev]);
        const pRes = await projectsService.fetchProjects();
        if (pRes.data) setProjects(pRes.data);
      }
    } else {
      const created: TaskItem = {
        id: `task-${Date.now()}`,
        title: newTask.title || 'Untitled task',
        category: (newTask.category as any) || 'Personal',
        source: newTask.source || 'Manual QuickAdd',
        status: newTask.status || 'Upcoming',
        due: newTask.due || 'Today',
        completed: false,
        priorityGroup: newTask.priorityGroup || 'Must Do',
      };
      setTasks(prev => [created, ...prev]);
    }

    setQuickAddOpen(false);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleRetryNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, deliveryStatus: 'Email delivered', time: 'Just now' }
          : n
      )
    );
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <OverviewView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onSelectTab={setCurrentTab}
            onOpenQuickAdd={() => setQuickAddOpen(true)}
          />
        );
      case 'my-day':
        return (
          <MyDayView
            tasks={tasks}
            habits={habits}
            onToggleTask={handleToggleTask}
            onToggleHabit={handleToggleHabit}
            onSelectTab={setCurrentTab}
            onOpenQuickAdd={() => setQuickAddOpen(true)}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            events={events}
            onOpenQuickAdd={() => setQuickAddOpen(true)}
          />
        );
      case 'tasks-and-projects':
        return (
          <TasksProjectsView
            tasks={tasks}
            projects={projects}
            onOpenQuickAdd={() => setQuickAddOpen(true)}
            onSelectTab={setCurrentTab}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            isCloudConnected={!!user}
            loadingCloudData={isCloudLoading}
            cloudError={cloudError}
          />
        );
      case 'academics':
        return (
          <AcademicsView
            onOpenQuickAdd={() => setQuickAddOpen(true)}
            onSelectTab={setCurrentTab}
          />
        );
      case 'toastmasters':
        return (
          <ToastmastersView
            onOpenQuickAdd={() => setQuickAddOpen(true)}
            onSelectTab={setCurrentTab}
          />
        );
      case 'career-and-learning':
        return (
          <CareerView
            onOpenQuickAdd={() => setQuickAddOpen(true)}
            onSelectTab={setCurrentTab}
          />
        );
      case 'creative-studio':
        return (
          <CreativeStudioView
            onOpenQuickAdd={() => setQuickAddOpen(true)}
            onSelectTab={setCurrentTab}
          />
        );
      case 'habits-and-wellness':
        return (
          <HabitsView
            onOpenQuickAdd={() => setQuickAddOpen(true)}
            onSelectTab={setCurrentTab}
          />
        );
      case 'analytics':
        return <AnalyticsView onSelectTab={setCurrentTab} />;
      case 'integrations':
        return <IntegrationsView onSelectTab={setCurrentTab} />;
      case 'settings':
        return <SettingsView onSelectTab={setCurrentTab} />;
      default:
        return (
          <OverviewView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onSelectTab={setCurrentTab}
            onOpenQuickAdd={() => setQuickAddOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#C9D8E6] text-[#151618] select-none font-outfit antialiased">
      {/* Fixed Deep Charcoal Left Navigation Bar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenQuickAdd={() => setQuickAddOpen(true)}
      />

      {/* Main App Canvas Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header Bar */}
        <Header
          onSelectTab={setCurrentTab}
          onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
          notificationsOpen={notificationsOpen}
          unreadCount={unreadCount}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDesktopWindowMode={isDesktopWindowMode}
          onToggleWindowMode={() => setIsDesktopWindowMode(!isDesktopWindowMode)}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        {/* Dynamic View Canvas */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {renderActiveView()}
        </main>

        {/* Flyout Notifications Drawer */}
        <NotificationsFlyout
          notifications={notifications}
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          onMarkAllRead={handleMarkAllRead}
          onSelectTab={setCurrentTab}
          onRetryNotification={handleRetryNotification}
        />

        {/* Global Quick Add / Command Palette Modal */}
        <QuickAddModal
          isOpen={quickAddOpen}
          onClose={() => setQuickAddOpen(false)}
          onAddTask={handleAddTask}
        />

        {/* Supabase Authentication & Profile Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    </div>
  );
}
