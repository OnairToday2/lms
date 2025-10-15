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
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      class_fields: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
          slug: string | null
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          slug?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          slug?: string | null
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      class_hash_tag: {
        Row: {
          class_room_id: string | null
          created_at: string
          hash_tag_id: string | null
          id: string
        }
        Insert: {
          class_room_id?: string | null
          created_at?: string
          hash_tag_id?: string | null
          id?: string
        }
        Update: {
          class_room_id?: string | null
          created_at?: string
          hash_tag_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_hash_tag_class_room_id_fkey"
            columns: ["class_room_id"]
            isOneToOne: false
            referencedRelation: "class_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_hash_tag_hash_tag_id_fkey"
            columns: ["hash_tag_id"]
            isOneToOne: false
            referencedRelation: "hash_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      class_room_employee: {
        Row: {
          class_room_id: string | null
          created_at: string
          employee_id: string | null
          id: number
        }
        Insert: {
          class_room_id?: string | null
          created_at?: string
          employee_id?: string | null
          id?: number
        }
        Update: {
          class_room_id?: string | null
          created_at?: string
          employee_id?: string | null
          id?: number
        }
        Relationships: []
      }
      class_room_field: {
        Row: {
          class_field_id: string | null
          class_room_id: string | null
          created_at: string
          id: string
        }
        Insert: {
          class_field_id?: string | null
          class_room_id?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          class_field_id?: string | null
          class_room_id?: string | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_room_field_class_field_id_fkey"
            columns: ["class_field_id"]
            isOneToOne: false
            referencedRelation: "class_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_room_field_class_room_id_fkey"
            columns: ["class_room_id"]
            isOneToOne: false
            referencedRelation: "class_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      class_room_metadata: {
        Row: {
          class_room_id: string | null
          created_at: string
          id: string
          key: string | null
          value: Json | null
        }
        Insert: {
          class_room_id?: string | null
          created_at?: string
          id?: string
          key?: string | null
          value?: Json | null
        }
        Update: {
          class_room_id?: string | null
          created_at?: string
          id?: string
          key?: string | null
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "class_room_metadata_class_room_id_fkey"
            columns: ["class_room_id"]
            isOneToOne: false
            referencedRelation: "class_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      class_rooms: {
        Row: {
          comunity_info: Json | null
          created_at: string
          description: string | null
          id: string
          resource_id: string | null
          room_type: Database["public"]["Enums"]["class_room_type"] | null
          slug: string | null
          status: Database["public"]["Enums"]["class_room_status"]
          thumbnail_url: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          comunity_info?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          resource_id?: string | null
          room_type?: Database["public"]["Enums"]["class_room_type"] | null
          slug?: string | null
          status?: Database["public"]["Enums"]["class_room_status"]
          thumbnail_url?: string | null
          title?: string | null
          user_id?: string
        }
        Update: {
          comunity_info?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          resource_id?: string | null
          room_type?: Database["public"]["Enums"]["class_room_type"] | null
          slug?: string | null
          status?: Database["public"]["Enums"]["class_room_status"]
          thumbnail_url?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      class_session_metadata: {
        Row: {
          class_session_id: string
          id: string
          key: string | null
          value: Json | null
        }
        Insert: {
          class_session_id?: string
          id?: string
          key?: string | null
          value?: Json | null
        }
        Update: {
          class_session_id?: string
          id?: string
          key?: string | null
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "class_session_metadata_class_session_id_fkey"
            columns: ["class_session_id"]
            isOneToOne: false
            referencedRelation: "class_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      class_session_teacher: {
        Row: {
          class_session_id: string | null
          created_at: string
          id: string
          teacher_id: string | null
        }
        Insert: {
          class_session_id?: string | null
          created_at?: string
          id?: string
          teacher_id?: string | null
        }
        Update: {
          class_session_id?: string | null
          created_at?: string
          id?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_session_teacher_class_session_id_fkey"
            columns: ["class_session_id"]
            isOneToOne: false
            referencedRelation: "class_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_session_teacher_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      class_sessions: {
        Row: {
          channel_info: Json | null
          channel_provider:
          | Database["public"]["Enums"]["channel_provider"]
          | null
          class_room_id: string | null
          created_at: string
          description: string | null
          end_at: string | null
          id: string
          is_online: boolean | null
          limit_person: number | null
          resource_ids: string | null
          start_at: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          channel_info?: Json | null
          channel_provider?:
          | Database["public"]["Enums"]["channel_provider"]
          | null
          class_room_id?: string | null
          created_at?: string
          description?: string | null
          end_at?: string | null
          id?: string
          is_online?: boolean | null
          limit_person?: number | null
          resource_ids?: string | null
          start_at?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          channel_info?: Json | null
          channel_provider?:
          | Database["public"]["Enums"]["channel_provider"]
          | null
          class_room_id?: string | null
          created_at?: string
          description?: string | null
          end_at?: string | null
          id?: string
          is_online?: boolean | null
          limit_person?: number | null
          resource_ids?: string | null
          start_at?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_session_class_room_id_fkey"
            columns: ["class_room_id"]
            isOneToOne: false
            referencedRelation: "class_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      class_sessions_agendas: {
        Row: {
          class_session_id: string | null
          created_at: string
          description: string | null
          end_at: string | null
          id: string
          start_at: string | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          class_session_id?: string | null
          created_at?: string
          description?: string | null
          end_at?: string | null
          id?: string
          start_at?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          class_session_id?: string | null
          created_at?: string
          description?: string | null
          end_at?: string | null
          id?: string
          start_at?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_sessions_agendas_class_session_id_fkey"
            columns: ["class_session_id"]
            isOneToOne: false
            referencedRelation: "class_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      hash_tags: {
        Row: {
          created_at: string
          id: string
          name: string | null
          slug: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          slug?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          slug?: string | null
        }
        Relationships: []
      }
      libraries: {
        Row: {
          created_at: string
          id: number
          resource_name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          resource_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          resource_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string
          id: string | null
          library_id: number | null
          path: string | null
          size: string | null
          title: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string | null
          library_id?: number | null
          path?: string | null
          size?: string | null
          title?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string | null
          library_id?: number | null
          path?: string | null
          size?: string | null
          title?: string | null
          type?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          birth_of_date: string | null
          code: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          birth_of_date?: string | null
          code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          birth_of_date?: string | null
          code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      class_room_status_counts: {
        Args: { _tz?: string }
        Returns: Json
      }
    }
    Enums: {
      channel_provider: "google_meet" | "zoom" | "microsoft_teams"
      class_room_status:
      | "publish"
      | "active"
      | "deactive"
      | "pending"
      | "deleted"
      | "draft"
      class_room_statuss: "draft" | "published" | "archived"
      class_room_type: "single" | "multiple"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
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
      channel_provider: ["google_meet", "zoom", "microsoft_teams"],
      class_room_status: [
        "publish",
        "active",
        "deactive",
        "pending",
        "deleted",
        "draft",
      ],
      class_room_statuss: ["draft", "published", "archived"],
      class_room_type: ["single", "multiple"],
    },
  },
} as const

