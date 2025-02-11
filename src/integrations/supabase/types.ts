export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          awarded_at: string
          description: string | null
          goal_id: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          description?: string | null
          goal_id?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          description?: string | null
          goal_id?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          description: string
          duration: string
          exercise_type: string
          id: string
          instructions: string[]
          level: string
          repetitions: string
          safety_notes: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          duration: string
          exercise_type: string
          id?: string
          instructions: string[]
          level: string
          repetitions: string
          safety_notes: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string
          exercise_type?: string
          id?: string
          instructions?: string[]
          level?: string
          repetitions?: string
          safety_notes?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          current_count: number
          description: string | null
          id: string
          last_tracked_at: string | null
          streak_count: number
          target_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_count?: number
          description?: string | null
          id?: string
          last_tracked_at?: string | null
          streak_count?: number
          target_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_count?: number
          description?: string | null
          id?: string
          last_tracked_at?: string | null
          streak_count?: number
          target_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      program_recommendations: {
        Row: {
          created_at: string
          daily_tips: string[]
          focus_areas: string[]
          frequency_advice: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_tips: string[]
          focus_areas: string[]
          frequency_advice: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_tips?: string[]
          focus_areas?: string[]
          frequency_advice?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_bios: {
        Row: {
          about_me: string | null
          bio_summary: string | null
          created_at: string
          diagnosis_date: string | null
          has_seen_physio: boolean | null
          id: string
          mobility_description: string | null
          physio_feedback: string | null
          situation: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          about_me?: string | null
          bio_summary?: string | null
          created_at?: string
          diagnosis_date?: string | null
          has_seen_physio?: boolean | null
          id?: string
          mobility_description?: string | null
          physio_feedback?: string | null
          situation?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          about_me?: string | null
          bio_summary?: string | null
          created_at?: string
          diagnosis_date?: string | null
          has_seen_physio?: boolean | null
          id?: string
          mobility_description?: string | null
          physio_feedback?: string | null
          situation?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
