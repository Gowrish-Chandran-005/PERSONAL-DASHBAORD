import { supabase } from '../lib/supabaseClient';
import type { Database } from '../types/database.types';
import type { ProjectItem } from '../types';
import { toUiProject, generateProjectSlug, mapCategoryToProjectDomain } from '../adapters/projectsAdapter';

type DbProject = Database['public']['Tables']['projects']['Row'];
type LifecycleState = Database['public']['Enums']['lifecycle_state'];
type DomainContext = Database['public']['Enums']['domain_context'];

export interface CreateProjectParams {
  title: string;
  description?: string;
  category?: string;
  domain?: DomainContext;
  state?: LifecycleState;
  slug?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateProjectParams {
  title?: string;
  description?: string;
  domain?: DomainContext;
  state?: LifecycleState;
  slug?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Projects Service for GOWRISH OS
 * Derives user identity strictly from the authenticated Supabase session.
 */
export const projectsService = {
  /**
   * Fetches all projects for the authenticated user and calculates derived progress
   * based on linked task completion counts.
   */
  async fetchProjects(): Promise<{ data: ProjectItem[]; raw: DbProject[]; error: Error | null }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { data: [], raw: [], error: new Error('Unauthorized: Active user session required.') };
      }

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) {
        return { data: [], raw: [], error: new Error(projectsError.message) };
      }

      // Fetch linked tasks to compute documented derived progress
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('project_id, status');

      // Group tasks by project_id
      const statsMap = new Map<string, { total: number; completed: number }>();
      if (tasksData) {
        for (const t of tasksData) {
          if (!t.project_id) continue;
          const curr = statsMap.get(t.project_id) || { total: 0, completed: 0 };
          curr.total += 1;
          if (t.status === 'done') curr.completed += 1;
          statsMap.set(t.project_id, curr);
        }
      }

      const mapped = (projectsData || []).map((p) => {
        const stats = statsMap.get(p.id);
        return toUiProject(p, stats);
      });

      return { data: mapped, raw: projectsData || [], error: null };
    } catch (err) {
      return { data: [], raw: [], error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  /**
   * Creates a new project for the authenticated user
   */
  async createProject(params: CreateProjectParams): Promise<{ data: ProjectItem | null; raw: DbProject | null; error: Error | null }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { data: null, raw: null, error: new Error('Unauthorized: Active user session required.') };
      }

      if (!params.title || params.title.trim().length === 0) {
        return { data: null, raw: null, error: new Error('Validation error: Project title cannot be empty.') };
      }

      const domain: DomainContext = params.domain || (params.category ? mapCategoryToProjectDomain(params.category) : 'general');
      const slug = params.slug?.trim() || generateProjectSlug(params.title);

      const insertPayload: Database['public']['Tables']['projects']['Insert'] = {
        user_id: user.id, // Strictly derived from session
        title: params.title.trim(),
        description: params.description?.trim() || null,
        domain,
        slug,
        state: params.state || 'active',
        metadata: (params.metadata || {}) as Database['public']['Tables']['projects']['Insert']['metadata'],
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        return { data: null, raw: null, error: new Error(error.message) };
      }

      return { data: toUiProject(data), raw: data, error: null };
    } catch (err) {
      return { data: null, raw: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  /**
   * Updates an existing project
   */
  async updateProject(id: string, updates: UpdateProjectParams): Promise<{ data: ProjectItem | null; raw: DbProject | null; error: Error | null }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { data: null, raw: null, error: new Error('Unauthorized: Active user session required.') };
      }

      const updatePayload: Database['public']['Tables']['projects']['Update'] = {};

      if (updates.title !== undefined) {
        updatePayload.title = updates.title.trim();
        if (!updates.slug) {
          updatePayload.slug = generateProjectSlug(updates.title);
        }
      }
      if (updates.description !== undefined) updatePayload.description = updates.description ? updates.description.trim() : null;
      if (updates.domain !== undefined) updatePayload.domain = updates.domain;
      if (updates.state !== undefined) updatePayload.state = updates.state;
      if (updates.slug !== undefined) updatePayload.slug = updates.slug.trim();
      if (updates.metadata !== undefined) updatePayload.metadata = updates.metadata as Database['public']['Tables']['projects']['Update']['metadata'];

      const { data, error } = await supabase
        .from('projects')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, raw: null, error: new Error(error.message) };
      }

      return { data: toUiProject(data), raw: data, error: null };
    } catch (err) {
      return { data: null, raw: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  /**
   * Deletes a project by ID
   */
  async deleteProject(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { success: false, error: new Error('Unauthorized: Active user session required.') };
      }

      const { error } = await supabase
        .from('projects')
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
