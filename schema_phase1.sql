-- ============================================================================
-- GOWRISH OS: Phase 1 Database Schema (Fully Idempotent & Re-run Safe)
-- Supabase Project: lstjudriggslcsjbvuvr
-- ============================================================================

-- 1. ENUM TYPES (Safe creation)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('member', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.domain_context AS ENUM ('general', 'academics', 'toastmasters', 'career', 'creative');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.lifecycle_state AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.task_lifecycle AS ENUM ('inbox', 'scheduled', 'in_progress', 'blocked', 'done', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.recurrence_kind AS ENUM ('daily', 'weekly', 'interval');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.sync_outcome AS ENUM ('started', 'succeeded', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. TRIGGER FUNCTIONS
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = clock_timestamp();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_role_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF COALESCE(auth.jwt() ->> 'role', '') != 'service_role' THEN
            RAISE EXCEPTION 'Role elevation denied: only service_role can modify user roles';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- 3. CORE TABLES

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL DEFAULT '',
    timezone_name TEXT NOT NULL DEFAULT 'UTC',
    role public.app_role NOT NULL DEFAULT 'member',
    preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_role_check ON public.profiles;
CREATE TRIGGER trg_profiles_role_check BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.check_role_change();

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain public.domain_context NOT NULL DEFAULT 'general',
    slug TEXT NOT NULL,
    title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
    description TEXT,
    state public.lifecycle_state NOT NULL DEFAULT 'active',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uq_user_project_slug UNIQUE (user_id, slug)
);
DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Goals
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    domain public.domain_context NOT NULL DEFAULT 'general',
    title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
    target_date DATE,
    progress_pct INT NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
    state public.lifecycle_state NOT NULL DEFAULT 'active',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);
DROP TRIGGER IF EXISTS trg_goals_updated_at ON public.goals;
CREATE TRIGGER trg_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    domain public.domain_context NOT NULL DEFAULT 'general',
    title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
    description TEXT,
    urgency public.urgency_level NOT NULL DEFAULT 'medium',
    status public.task_lifecycle NOT NULL DEFAULT 'inbox',
    due_at TIMESTAMPTZ,
    allocated_minutes INT CHECK (allocated_minutes IS NULL OR allocated_minutes > 0),
    completed_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);
DROP TRIGGER IF EXISTS trg_tasks_updated_at ON public.tasks;
CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Calendar Events
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    is_full_day BOOLEAN NOT NULL DEFAULT false,
    external_sync_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT chk_event_window CHECK (end_at >= start_at)
);
DROP TRIGGER IF EXISTS trg_calendar_updated_at ON public.calendar_events;
CREATE TRIGGER trg_calendar_updated_at BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Habits & Habit Logs
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain public.domain_context NOT NULL DEFAULT 'general',
    title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
    recurrence public.recurrence_kind NOT NULL DEFAULT 'daily',
    target_per_cycle INT NOT NULL DEFAULT 1 CHECK (target_per_cycle > 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);
DROP TRIGGER IF EXISTS trg_habits_updated_at ON public.habits;
CREATE TRIGGER trg_habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE IF NOT EXISTS public.habit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    units_completed INT NOT NULL DEFAULT 1 CHECK (units_completed >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uq_habit_date UNIQUE (habit_id, entry_date)
);

-- Focus Sessions
CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    session_minutes INT NOT NULL CHECK (session_minutes > 0),
    started_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    ended_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    headline TEXT NOT NULL,
    details TEXT,
    is_dismissed BOOLEAN NOT NULL DEFAULT false,
    action_route TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- Integration Connections & Sync Runs
CREATE TABLE IF NOT EXISTS public.integration_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    account_label TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    access_token_secret_id UUID,
    refresh_token_secret_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uq_service_account UNIQUE (user_id, service_name, account_label),
    CONSTRAINT chk_no_cleartext_tokens CHECK (
        NOT (metadata ?| ARRAY['access_token', 'refresh_token', 'client_secret', 'password'])
    )
);
DROP TRIGGER IF EXISTS trg_integrations_updated_at ON public.integration_connections;
CREATE TRIGGER trg_integrations_updated_at BEFORE UPDATE ON public.integration_connections FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE IF NOT EXISTS public.sync_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    connection_id UUID NOT NULL REFERENCES public.integration_connections(id) ON DELETE CASCADE,
    outcome public.sync_outcome NOT NULL DEFAULT 'started',
    records_processed INT NOT NULL DEFAULT 0 CHECK (records_processed >= 0),
    error_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_lookup ON public.projects(user_id, domain, state);
CREATE INDEX IF NOT EXISTS idx_goals_lookup ON public.goals(user_id, state);
CREATE INDEX IF NOT EXISTS idx_tasks_timeline ON public.tasks(user_id, status, due_at);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_calendar_lookup ON public.calendar_events(user_id, start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_habits_active ON public.habits(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_habit_logs_query ON public.habit_logs(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_focus_history ON public.focus_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_pending ON public.notifications(user_id) WHERE is_dismissed = false;
CREATE INDEX IF NOT EXISTS idx_sync_history ON public.sync_runs(connection_id, created_at DESC);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;

-- Helper function to generate standard CRUD RLS policies safely
CREATE OR REPLACE FUNCTION public.create_standard_rls(tbl TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
    EXECUTE format('DROP POLICY IF EXISTS "%s_select" ON public.%I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_insert" ON public.%I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_update" ON public.%I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_delete" ON public.%I;', tbl, tbl);

    EXECUTE format('CREATE POLICY "%s_select" ON public.%I FOR SELECT TO authenticated USING (auth.uid() = user_id);', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_insert" ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_update" ON public.%I FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_delete" ON public.%I FOR DELETE TO authenticated USING (auth.uid() = user_id);', tbl, tbl);
END;
$$;

-- Apply to user-owned tables
SELECT public.create_standard_rls('projects');
SELECT public.create_standard_rls('goals');
SELECT public.create_standard_rls('tasks');
SELECT public.create_standard_rls('calendar_events');
SELECT public.create_standard_rls('habits');
SELECT public.create_standard_rls('habit_logs');
SELECT public.create_standard_rls('focus_sessions');
SELECT public.create_standard_rls('notifications');
SELECT public.create_standard_rls('integration_connections');
SELECT public.create_standard_rls('sync_runs');

-- Profiles policies (mapped to id instead of user_id)
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Clean up helper function
DROP FUNCTION public.create_standard_rls(TEXT);
