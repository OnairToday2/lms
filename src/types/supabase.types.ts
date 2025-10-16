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
      class_fields: {
        Row: {
          created_at: string
          id: string
          name: string | null
          slug: string | null
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          slug?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string
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
            foreignKeyName: "class_hash_tag_class_room_id_fkey"
            columns: ["class_room_id"]
            isOneToOne: false
            referencedRelation: "class_rooms_priority_v2"
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
        Relationships: [
          {
            foreignKeyName: "class_room_employee_class_room_id_fkey"
            columns: ["class_room_id"]
            isOneToOne: false
            referencedRelation: "class_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_room_employee_class_room_id_fkey"
            columns: ["class_room_id"]
            isOneToOne: false
            referencedRelation: "class_rooms_priority_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_room_employee_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "class_room_field_class_room_id_fkey"
            columns: ["class_room_id"]
            isOneToOne: false
            referencedRelation: "class_rooms_priority_v2"
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
          {
            foreignKeyName: "class_room_metadata_class_room_id_fkey"
            columns: ["class_room_id"]
            isOneToOne: false
            referencedRelation: "class_rooms_priority_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      class_rooms: {
        Row: {
          class_field_id: number | null
          community_info: string | null
          created_at: string
          description: string | null
          end_at: string | null
          id: string
          resource_id: string | null
          room_type: Database["public"]["Enums"]["class_room_type"] | null
          slug: string | null
          start_at: string | null
          status: Database["public"]["Enums"]["class_room_status"] | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          class_field_id?: number | null
          community_info?: string | null
          created_at?: string
          description?: string | null
          end_at?: string | null
          id?: string
          resource_id?: string | null
          room_type?: Database["public"]["Enums"]["class_room_type"] | null
          slug?: string | null
          start_at?: string | null
          status?: Database["public"]["Enums"]["class_room_status"] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          class_field_id?: number | null
          community_info?: string | null
          created_at?: string
          description?: string | null
          end_at?: string | null
          id?: string
          resource_id?: string | null
          room_type?: Database["public"]["Enums"]["class_room_type"] | null
          slug?: string | null
          start_at?: string | null
          status?: Database["public"]["Enums"]["class_room_status"] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
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
          channel_provider: string | null
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
          channel_provider?: string | null
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
          channel_provider?: string | null
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
          {
            foreignKeyName: "class_session_class_room_id_fkey"
            columns: ["class_room_id"]
            isOneToOne: false
            referencedRelation: "class_rooms_priority_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          employee_code: string
          employee_order: number | null
          id: string
          position_id: string | null
          start_date: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          employee_code: string
          employee_order?: number | null
          id?: string
          position_id?: string | null
          start_date?: string | null
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          employee_code?: string
          employee_order?: number | null
          id?: string
          position_id?: string | null
          start_date?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      employments: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          organization_unit_id: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          organization_unit_id: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          organization_unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employments_organization_unit_id_fkey"
            columns: ["organization_unit_id"]
            isOneToOne: false
            referencedRelation: "organization_units"
            referencedColumns: ["id"]
          },
        ]
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
          id?: never
          resource_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          resource_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      managers_employees: {
        Row: {
          employee_id: string
          manager_id: string
        }
        Insert: {
          employee_id: string
          manager_id: string
        }
        Update: {
          employee_id?: string
          manager_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "managers_employees_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "managers_employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_units: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          parent_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          parent_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          parent_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_units_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_units_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "organization_units"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          birthday: string | null
          created_at: string
          email: string
          employee_id: string
          full_name: string
          gender: string
          id: string
          phone_number: string
        }
        Insert: {
          avatar?: string | null
          birthday?: string | null
          created_at?: string
          email: string
          employee_id: string
          full_name: string
          gender: string
          id?: string
          phone_number: string
        }
        Update: {
          avatar?: string | null
          birthday?: string | null
          created_at?: string
          email?: string
          employee_id?: string
          full_name?: string
          gender?: string
          id?: string
          phone_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
      class_rooms_priority_v2: {
        Row: {
          class_field_id: number | null
          community_info: string | null
          computed_end_at: string | null
          computed_start_at: string | null
          created_at: string | null
          description: string | null
          end_at: string | null
          id: string | null
          resource_id: string | null
          room_type: Database["public"]["Enums"]["class_room_type"] | null
          runtime_status: string | null
          slug: string | null
          sort_rank_primary: number | null
          sort_rank_secondary: number | null
          start_at: string | null
          status: Database["public"]["Enums"]["class_room_status"] | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      class_room_status_counts_filtered: {
        Args: {
          in_from: string
          in_owner_id: string
          in_search: string
          in_to: string
          in_user_id: string
        }
        Returns: {
          runtime_status: string
          total: number
        }[]
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
      class_room_type: ["single", "multiple"],
    },
  },
} as const

