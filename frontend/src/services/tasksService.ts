import { supabase } from '../lib/supabaseClient';
import type { Database } from '../types/database.types';
import type { TaskItem } from '../types';
import { toUiTask, mapCategoryToDbDomain } from '../adapters/tasksAdapter';

type DbTask = Database['public']['Tables']['tasks']['Row'];
type TaskLifecycle = Database['public']['Enums']['task_lifecycle'];
type UrgencyLevel = Database['public']['Enums']['urgency_level'];
type DomainContext = Database['public']['Enums']['domain_context'];

export interface CreateTaskParams {
  title: string;
  description?: string;
  category?: TaskItem['category'];
  domain?: DomainContext;
  urgency?: UrgencyLevel;
  status?: TaskLifecycle;
  dueAt?: string;
  projectId?: string;
  goalId?: string;
  allocatedMinutes?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateTaskParams {
  title?: string;
  description?: string;
  domain?: DomainContext;
  urgency?: UrgencyLevel;
  status?: TaskLifecycle;
  dueAt?: string | null;
  projectId?: string | null;
  goalId?: string | null;
  allocatedMinutes?: number | null;
  completedAt?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Tasks Service for GOWRISH OS
 * All operations derive user ownership securely from the authenticated Supabase session.
 */
export const tasksService = {
  /**
   * Fetches all tasks belonging to the authenticated user
   */
  async fetchTasks(): Promise<{ data: TaskItem[]; raw: DbTask[]; error: Error | null }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { data: [], raw: [], error: new Error('Unauthorized: Active user session required.') };
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], raw: [], error: new Error(error.message) };
      }

      const mapped = (data || []).map(toUiTask);
      return { data: mapped, raw: data || [], error: null };
    } catch (err) {
      return { data: [], raw: [], error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  /**
   * Creates a new task for the authenticated user
   */
  async createTask(params: CreateTaskParams): Promise<{ data: TaskItem | null; raw: DbTask | null; error: Error | null }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { data: null, raw: null, error: new Error('Unauthorized: Active user session required.') };
      }

      if (!params.title || params.title.trim().length === 0) {
        return { data: null, raw: null, error: new Error('Validation error: Task title cannot be empty.') };
      }

      const domain: DomainContext = params.domain || (params.category ? mapCategoryToDbDomain(params.category) : 'general');

      const insertPayload: Database['public']['Tables']['tasks']['Insert'] = {
        user_id: user.id, // Strictly derived from auth session
        title: params.title.trim(),
        description: params.description?.trim() || null,
        domain,
        urgency: params.urgency || 'medium',
        status: params.status || 'inbox',
        due_at: params.dueAt || null,
        project_id: params.projectId || null,
        goal_id: params.goalId || null,
        allocated_minutes: params.allocatedMinutes || null,
        metadata: (params.metadata || {}) as Database['public']['Tables']['tasks']['Insert']['metadata'],
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        return { data: null, raw: null, error: new Error(error.message) };
      }

      return { data: toUiTask(data), raw: data, error: null };
    } catch (err) {
      return { data: null, raw: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  /**
   * Updates an existing task
   */
  async updateTask(id: string, updates: UpdateTaskParams): Promise<{ data: TaskItem | null; raw: DbTask | null; error: Error | null }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { data: null, raw: null, error: new Error('Unauthorized: Active user session required.') };
      }

      const updatePayload: Database['public']['Tables']['tasks']['Update'] = {};

      if (updates.title !== undefined) updatePayload.title = updates.title.trim();
      if (updates.description !== undefined) updatePayload.description = updates.description ? updates.description.trim() : null;
      if (updates.domain !== undefined) updatePayload.domain = updates.domain;
      if (updates.urgency !== undefined) updatePayload.urgency = updates.urgency;
      if (updates.status !== undefined) {
        updatePayload.status = updates.status;
        if (updates.status === 'done' && !updates.completedAt) {
          updatePayload.completed_at = new Date().toISOString();
        } else if (updates.status !== 'done') {
          updatePayload.completed_at = null;
        }
      }
      if (updates.dueAt !== undefined) updatePayload.due_at = updates.dueAt;
      if (updates.projectId !== undefined) updatePayload.project_id = updates.projectId;
      if (updates.goalId !== undefined) updatePayload.goal_id = updates.goalId;
      if (updates.allocatedMinutes !== undefined) updatePayload.allocated_minutes = updates.allocatedMinutes;
      if (updates.completedAt !== undefined) updatePayload.completed_at = updates.completedAt;
      if (updates.metadata !== undefined) updatePayload.metadata = updates.metadata as Database['public']['Tables']['tasks']['Update']['metadata'];

      const { data, error } = await supabase
        .from('tasks')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, raw: null, error: new Error(error.message) };
      }

      return { data: toUiTask(data), raw: data, error: null };
    } catch (err) {
      return { data: null, raw: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  /**
   * Toggles completion status of a task
   */
  async toggleTask(id: string, currentStatus: TaskLifecycle): Promise<{ data: TaskItem | null; error: Error | null }> {
    const nextStatus: TaskLifecycle = currentStatus === 'done' ? 'inbox' : 'done';
    return this.updateTask(id, { status: nextStatus });
  },

  /**
   * Deletes a task by ID
   */
  async deleteTask(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { success: false, error: new Error('Unauthorized: Active user session required.') };
      }

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: new Error(error.message) };
      }

      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
    }
  },
};
