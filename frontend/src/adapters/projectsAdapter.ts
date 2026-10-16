import type { Database } from '../types/database.types';
import type { ProjectItem } from '../types';

export type DbProject = Database['public']['Tables']['projects']['Row'];
export type DbProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type DbProjectUpdate = Database['public']['Tables']['projects']['Update'];

type DomainContext = Database['public']['Enums']['domain_context'];
type LifecycleState = Database['public']['Enums']['lifecycle_state'];

/**
 * Maps database lifecycle state to frontend project status
 */
export function mapDbStateToProjectStatus(state: LifecycleState): ProjectItem['status'] {
  switch (state) {
    case 'active':
      return 'Active Build';
    case 'draft':
    case 'paused':
      return 'Planning';
    case 'completed':
    case 'archived':
    default:
      return 'In Progress';
  }
}

/**
 * Maps frontend project category to database domain
 */
export function mapCategoryToProjectDomain(category: string): DomainContext {
  const normalized = category.toLowerCase();
  if (normalized.includes('academic') || normalized.includes('b.tech') || normalized.includes('vtop')) {
    return 'academics';
  }
  if (normalized.includes('toastmaster') || normalized.includes('speech')) {
    return 'toastmasters';
  }
  if (normalized.includes('career') || normalized.includes('internship') || normalized.includes('ai')) {
    return 'career';
  }
  if (normalized.includes('creative') || normalized.includes('design') || normalized.includes('studio')) {
    return 'creative';
  }
  return 'general';
}

/**
 * Generates a clean URL/database safe slug from project title
 */
export function generateProjectSlug(title: string): string {
  const sanitized = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return sanitized || `project-${Date.now().toString(36)}`;
}

/**
 * Converts a database project row to frontend ProjectItem model.
 * 
 * Progress Calculation Rule (Documented Derived Metric):
 * - If linked task counts are provided: Math.round((completedTasks / totalTasks) * 100).
 * - Otherwise: 0 (No synthetic progress is invented without a persisted task basis).
 */
export function toUiProject(
  dbProject: DbProject,
  taskStats?: { total: number; completed: number }
): ProjectItem {
  let progress = 0;
  if (taskStats && taskStats.total > 0) {
    progress = Math.round((taskStats.completed / taskStats.total) * 100);
  }

  const meta = (dbProject.metadata as Record<string, unknown>) || {};
  const dueDate = (meta.due_date as string) || 'Continuous';

  return {
    id: dbProject.id,
    name: dbProject.title,
    category: dbProject.domain.charAt(0).toUpperCase() + dbProject.domain.slice(1),
    status: mapDbStateToProjectStatus(dbProject.state),
    progress,
    dueDate,
    description: dbProject.description || undefined,
    version: (meta.version as string) || 'v1.0',
  };
}
