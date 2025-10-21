import { Database } from "@/types/supabase.types";

export class EmployeeDto {
  id!: string;
  employee_code!: string;
  start_date!: string | null;
  position_id!: string | null;
  user_id!: string;
  created_at!: string;
  profiles!: {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
    gender: Database["public"]["Enums"]["gender"];
    birthday: string | null;
    avatar: string | null;
  } | null;
  employments!: Array<{
    id: string;
    organization_unit_id: string;
    organization_units: {
      id: string;
      name: string;
      type: Database["public"]["Enums"]["organization_unit_type"];
    } | null;
  }>;
  managers_employees!: Array<{
    manager_id: string;
  }>;
}

