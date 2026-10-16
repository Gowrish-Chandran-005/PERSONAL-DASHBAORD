export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      calendar_events: {
        Row: {
          created_at: string
          end_at: string
          external_sync_id: string | null
          id: string
          is_full_day: boolean
          project_id: string | null
          start_at: string
          task_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_at: string
          external_sync_id?: string | null
          id?: string
          is_full_day?: boolean
          project_id?: string | null
          start_at: string
          task_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_at?: string
          external_sync_id?: string | null
          id?: string
          is_full_day?: boolean
          project_id?: string | null
          start_at?: string
          task_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          notes: string | null
          session_minutes: number
          started_at: string
          task_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          notes?: string | null
          session_minutes: number
          started_at?: string
          task_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          notes?: string | null
          session_minutes?: number
          started_at?: string
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_sessions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string
          domain: Database["public"]["Enums"]["domain_context"]
          id: string
          metadata: Json
          progress_pct: number
          project_id: string | null
          state: Database["public"]["Enums"]["lifecycle_state"]
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          domain?: Database["public"]["Enums"]["domain_context"]
          id?: string
          metadata?: Json
          progress_pct?: number
          project_id?: string | null
          state?: Database["public"]["Enums"]["lifecycle_state"]
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          domain?: Database["public"]["Enums"]["domain_context"]
          id?: string
          metadata?: Json
          progress_pct?: number
          project_id?: string | null
          state?: Database["public"]["Enums"]["lifecycle_state"]
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          created_at: string
          entry_date: string
          habit_id: string
          id: string
          units_completed: number
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_date: string
          habit_id: string
          id?: string
          units_completed?: number
          user_id: string
        }
        Update: {
          created_at?: string
          entry_date?: string
          habit_id?: string
          id?: string
          units_completed?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string
          domain: Database["public"]["Enums"]["domain_context"]
          id: string
          is_active: boolean
          recurrence: Database["public"]["Enums"]["recurrence_kind"]
          target_per_cycle: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          domain?: Database["public"]["Enums"]["domain_context"]
          id?: string
          is_active?: boolean
          recurrence?: Database["public"]["Enums"]["recurrence_kind"]
          target_per_cycle?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          domain?: Database["public"]["Enums"]["domain_context"]
          id?: string
          is_active?: boolean
          recurrence?: Database["public"]["Enums"]["recurrence_kind"]
          target_per_cycle?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      integration_connections: {
        Row: {
          access_token_secret_id: string | null
          account_label: string
          created_at: string
          id: string
          is_enabled: boolean
          metadata: Json
          refresh_token_secret_id: string | null
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_secret_id?: string | null
          account_label: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          metadata?: Json
          refresh_token_secret_id?: string | null
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_secret_id?: string | null
          account_label?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          metadata?: Json
          refresh_token_secret_id?: string | null
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_route: string | null
          created_at: string
          details: string | null
          headline: string
          id: string
          is_dismissed: boolean
          user_id: string
        }
        Insert: {
          action_route?: string | null
          created_at?: string
          details?: string | null
          headline: string
          id?: string
          is_dismissed?: boolean
          user_id: string
        }
        Update: {
          action_route?: string | null
          created_at?: string
          details?: string | null
          headline?: string
          id?: string
          is_dismissed?: boolean
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          preferences: Json
          role: Database["public"]["Enums"]["app_role"]
          timezone_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
          preferences?: Json
          role?: Database["public"]["Enums"]["app_role"]
          timezone_name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          preferences?: Json
          role?: Database["public"]["Enums"]["app_role"]
          timezone_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          domain: Database["public"]["Enums"]["domain_context"]
          id: string
          metadata: Json
          slug: string
          state: Database["public"]["Enums"]["lifecycle_state"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          domain?: Database["public"]["Enums"]["domain_context"]
          id?: string
          metadata?: Json
          slug: string
          state?: Database["public"]["Enums"]["lifecycle_state"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          domain?: Database["public"]["Enums"]["domain_context"]
          id?: string
          metadata?: Json
          slug?: string
          state?: Database["public"]["Enums"]["lifecycle_state"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sync_runs: {
        Row: {
          connection_id: string
          created_at: string
          error_summary: string | null
          id: string
          outcome: Database["public"]["Enums"]["sync_outcome"]
          records_processed: number
          user_id: string
        }
        Insert: {
          connection_id: string
          created_at?: string
          error_summary?: string | null
          id?: string
          outcome?: Database["public"]["Enums"]["sync_outcome"]
          records_processed?: number
          user_id: string
        }
        Update: {
          connection_id?: string
          created_at?: string
          error_summary?: string | null
          id?: string
          outcome?: Database["public"]["Enums"]["sync_outcome"]
          records_processed?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_runs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "integration_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          allocated_minutes: number | null
          completed_at: string | null
          created_at: string
          description: string | null
          domain: Database["public"]["Enums"]["domain_context"]
          due_at: string | null
          goal_id: string | null
          id: string
          metadata: Json
          project_id: string | null
          status: Database["public"]["Enums"]["task_lifecycle"]
          title: string
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level"]
          user_id: string
        }
        Insert: {
          allocated_minutes?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          domain?: Database["public"]["Enums"]["domain_context"]
          due_at?: string | null
          goal_id?: string | null
          id?: string
          metadata?: Json
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_lifecycle"]
          title: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
          user_id: string
        }
        Update: {
          allocated_minutes?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          domain?: Database["public"]["Enums"]["domain_context"]
          due_at?: string | null
          goal_id?: string | null
          id?: string
          metadata?: Json
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_lifecycle"]
          title?: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "member" | "admin"
      domain_context:
        | "general"
        | "academics"
        | "toastmasters"
        | "career"
        | "creative"
      lifecycle_state: "draft" | "active" | "paused" | "completed" | "archived"
      recurrence_kind: "daily" | "weekly" | "interval"
      sync_outcome: "started" | "succeeded" | "failed"
      task_lifecycle:
        | "inbox"
        | "scheduled"
        | "in_progress"
        | "blocked"
        | "done"
        | "cancelled"
      urgency_level: "low" | "medium" | "high" | "critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["member", "admin"],
      domain_context: [
        "general",
        "academics",
        "toastmasters",
        "career",
        "creative",
      ],
      lifecycle_state: ["draft", "active", "paused", "completed", "archived"],
      recurrence_kind: ["daily", "weekly", "interval"],
      sync_outcome: ["started", "succeeded", "failed"],
      task_lifecycle: [
        "inbox",
        "scheduled",
        "in_progress",
        "blocked",
        "done",
        "cancelled",
      ],
      urgency_level: ["low", "medium", "high", "critical"],
    },
  },
} as const
