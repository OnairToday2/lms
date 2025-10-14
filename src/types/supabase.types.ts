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
      employees: {
        Row: {
          created_at: string
          employee_code: string
          employee_order: number | null
          id: string
          position_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["employee_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          employee_code: string
          employee_order?: number | null
          id?: string
          position_id?: string | null
          start_date?: string | null
          status: Database["public"]["Enums"]["employee_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          employee_code?: string
          employee_order?: number | null
          id?: string
          position_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["employee_status"]
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
          type: Database["public"]["Enums"]["organization_unit_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          parent_id?: string | null
          type: Database["public"]["Enums"]["organization_unit_type"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          parent_id?: string | null
          type?: Database["public"]["Enums"]["organization_unit_type"]
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
          gender: Database["public"]["Enums"]["gender"]
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
          gender: Database["public"]["Enums"]["gender"]
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
          gender?: Database["public"]["Enums"]["gender"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      employee_status: "active" | "inactive"
      gender: "male" | "female" | "other"
      organization_unit_type: "branch" | "department"
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
      employee_status: ["active", "inactive"],
      gender: ["male", "female", "other"],
      organization_unit_type: ["branch", "department"],
    },
  },
} as const

