export type NavTabId =
  | 'overview'
  | 'my-day'
  | 'calendar'
  | 'tasks-and-projects'
  | 'academics'
  | 'toastmasters'
  | 'career-and-learning'
  | 'creative-studio'
  | 'habits-and-wellness'
  | 'analytics'
  | 'integrations'
  | 'settings';

export interface TaskItem {
  id: string;
  title: string;
  category: 'Academics' | 'Toastmasters' | 'Career' | 'Creative' | 'Habits' | 'Personal' | 'Sync' | 'Attendance';
  source?: string;
  status: 'Urgent' | 'Upcoming' | 'In review' | 'Preparing' | 'Failed' | 'Done' | 'Pending';
  due: string;
  duration?: string;
  time?: string;
  completed: boolean;
  priorityGroup?: 'Must Do' | 'Should Do' | 'If Time Permits';
  subtasksDone?: number;
  subtasksTotal?: number;
}

export interface CalendarEvent {
  id: string;
  day: number;
  month: number; // 9 = Oct
  year: number;
  title: string;
  category: 'Academics' | 'Toastmasters' | 'Career' | 'Creative' | 'Habits' | 'Personal';
  time?: string;
  location?: string;
  venue?: string;
  synced?: boolean;
  code?: string;
  details?: string;
  reminders?: string[];
  linkedTasks?: { id: string; text: string; done: boolean }[];
}

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  status: 'In Progress' | 'Data Prep' | 'Active Build' | 'Planning' | 'Research';
  progress: number;
  dueDate: string;
  version?: string;
  description?: string;
}

export interface AssessmentItem {
  id: string;
  name: string;
  subname: string;
  date: string;
  max: number;
  scored: number | null;
  weight: number;
  status: 'Upcoming' | 'Completed' | 'Evaluated' | 'Scheduled' | 'Pending';
}

export interface ToastmastersSession {
  id: string;
  number: number;
  title: string;
  theme: string;
  date: string;
  time: string;
  venue: string;
  rolesFilled: number;
  rolesTotal: number;
  status: 'Ready' | 'Briefing' | 'Planning';
}

export interface InternshipApplication {
  id: string;
  company: string;
  role: string;
  status: 'Wishlist' | 'Preparing' | 'Applied' | 'OA / Interview' | 'Offer' | 'Closed';
  deadline: string;
  resumeVersion: string;
  tags: string[];
  priority?: boolean;
}

export interface SkillMastery {
  id: string;
  name: string;
  completedTopics: number;
  totalTopics: number;
  hoursSpent: number;
  progressPercentage: number;
  color: string;
}

export interface CreativeAsset {
  id: string;
  name: string;
  type: 'Video' | '3D' | 'Vector' | 'Audio' | 'Still';
  format: 'MP4' | 'BLEND' | 'SVG' | 'PNG' | 'WAV';
  project: string;
  status: 'Final' | 'Draft';
  tags: string[];
  image: string;
  resolution?: string;
}

export interface HabitItem {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completionRate: number;
  color: string;
  history: boolean[]; // Mon - Sun (7 days)
}

export interface NotificationItem {
  id: string;
  title: string;
  category: 'Academics' | 'Deadlines' | 'Toastmasters' | 'Habits' | 'System';
  tag: string;
  time: string;
  read: boolean;
  deliveryStatus: 'Email delivered' | 'Email failed – retry' | 'In-app only';
  group: 'today' | 'earlier';
}

export interface IntegrationService {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'Connected' | 'Needs Attention' | 'Disconnected' | 'Active';
  statusColor: string;
  lastSuccess: string;
  lastAttempt: string;
  frequency: string;
  warningNote?: string;
  dataSynced: string[];
}
