-- ============================================================================
-- GOWRISH OS: Phase 1 Database Optimizations & Hardening
-- Resolves all Supabase Security & Performance Advisors (Linter 0001, 0003, 0011, 0028)
-- ============================================================================

-- 1. SECURITY HARDENING: Explicit search_path & RPC protection on trigger functions
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = clock_timestamp();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF COALESCE(auth.jwt() ->> 'role', '') != 'service_role' THEN
            RAISE EXCEPTION 'Role elevation denied: only service_role can modify user roles';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- Revoke direct API execution so PostgREST does not expose trigger function via RPC
REVOKE EXECUTE ON FUNCTION public.check_role_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- 2. COVERING INDEXES FOR UNINDEXED FOREIGN KEYS (Linter 0001)
CREATE INDEX IF NOT EXISTS idx_calendar_events_project_id ON public.calendar_events(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_calendar_events_task_id ON public.calendar_events(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_focus_sessions_task_id ON public.focus_sessions(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_goals_project_id ON public.goals(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON public.tasks(goal_id) WHERE goal_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sync_runs_user_id ON public.sync_runs(user_id);

-- 3. RLS INITPLAN OPTIMIZATION: Use (SELECT auth.uid()) (Linter 0003)
-- Evaluates auth.uid() once per query execution plan instead of per row.

CREATE OR REPLACE FUNCTION public.optimize_rls(tbl TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
    EXECUTE format('DROP POLICY IF EXISTS "%s_select" ON public.%I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_insert" ON public.%I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_update" ON public.%I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_delete" ON public.%I;', tbl, tbl);

    EXECUTE format('CREATE POLICY "%s_select" ON public.%I FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_insert" ON public.%I FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_update" ON public.%I FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_delete" ON public.%I FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);', tbl, tbl);
END;
$$;

SELECT public.optimize_rls('projects');
SELECT public.optimize_rls('goals');
SELECT public.optimize_rls('tasks');
SELECT public.optimize_rls('calendar_events');
SELECT public.optimize_rls('habits');
SELECT public.optimize_rls('habit_logs');
SELECT public.optimize_rls('focus_sessions');
SELECT public.optimize_rls('notifications');
SELECT public.optimize_rls('integration_connections');
SELECT public.optimize_rls('sync_runs');

DROP FUNCTION public.optimize_rls(TEXT);

-- Profiles policies optimization
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
