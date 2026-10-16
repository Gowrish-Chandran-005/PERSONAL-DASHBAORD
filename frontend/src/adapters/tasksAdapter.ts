import type { Database } from '../types/database.types';
import type { TaskItem } from '../types';

export type DbTask = Database['public']['Tables']['tasks']['Row'];
export type DbTaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type DbTaskUpdate = Database['public']['Tables']['tasks']['Update'];

type DomainContext = Database['public']['Enums']['domain_context'];
type TaskLifecycle = Database['public']['Enums']['task_lifecycle'];
type UrgencyLevel = Database['public']['Enums']['urgency_level'];

/**
 * Maps PostgreSQL domain_context enum to frontend category
 */
export function mapDbDomainToCategory(domain: DomainContext): TaskItem['category'] {
  switch (domain) {
    case 'academics':
      return 'Academics';
    case 'toastmasters':
      return 'Toastmasters';
    case 'career':
      return 'Career';
    case 'creative':
      return 'Creative';
    case 'general':
    default:
      return 'Personal';
  }
}

/**
 * Maps frontend category to PostgreSQL domain_context enum
 */
export function mapCategoryToDbDomain(category: TaskItem['category']): DomainContext {
  switch (category) {
    case 'Academics':
      return 'academics';
    case 'Toastmasters':
      return 'toastmasters';
    case 'Career':
      return 'career';
    case 'Creative':
      return 'creative';
    case 'Personal':
    case 'Habits':
    case 'Sync':
    case 'Attendance':
    default:
      return 'general';
  }
}

/**
 * Maps database lifecycle + urgency to frontend presentation status
 */
export function mapDbStatusToUi(status: TaskLifecycle, urgency: UrgencyLevel): TaskItem['status'] {
  if (status === 'done') return 'Done';
  if (urgency === 'critical') return 'Urgent';
  if (status === 'in_progress') return 'Preparing';
  if (status === 'scheduled') return 'Upcoming';
  if (status === 'blocked') return 'Failed';
  return 'Pending';
}

/**
 * Maps database urgency level to frontend priority group
 */
export function mapDbUrgencyToPriorityGroup(urgency: UrgencyLevel): TaskItem['priorityGroup'] {
  switch (urgency) {
    case 'critical':
    case 'high':
      return 'Must Do';
    case 'medium':
      return 'Should Do';
    case 'low':
    default:
      return 'If Time Permits';
  }
}

/**
 * Converts a database task row to the frontend TaskItem model
 */
export function toUiTask(dbTask: DbTask): TaskItem {
  const isDone = dbTask.status === 'done';
  const formattedDue = dbTask.due_at
    ? new Date(dbTask.due_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'No due date';

  return {
    id: dbTask.id,
    title: dbTask.title,
    category: mapDbDomainToCategory(dbTask.domain),
    status: mapDbStatusToUi(dbTask.status, dbTask.urgency),
    due: formattedDue,
    completed: isDone,
    duration: dbTask.allocated_minutes ? `${dbTask.allocated_minutes}m` : undefined,
    priorityGroup: mapDbUrgencyToPriorityGroup(dbTask.urgency),
    source: (dbTask.metadata as Record<string, unknown>)?.source as string | undefined,
  };
}
