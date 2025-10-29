import { Database } from "@/types/supabase.types";

export class UpdateEmployeeDto {
  id!: string;
  email!: string;
  full_name!: string;
  phone_number?: string;
  gender!: Database["public"]["Enums"]["gender"];
  birthday?: string | null;
  employee_code?: string;
  department!: string;
  branch?: string;
  manager_id!: string;
  role?: string;
  position_id?: string;
  start_date?: string | null;
}

