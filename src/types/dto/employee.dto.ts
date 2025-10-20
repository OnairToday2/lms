import { Database } from "@/types/supabase.types";

export interface CreateEmployeeDto {
  email: string;
  full_name: string;
  phone_number?: string;
  gender: Database["public"]["Enums"]["gender"];
  birthday?: string | null;
  branch?: string;
  department: string;
  employee_code?: string;
  manager_id: string;
  role?: string;
  position_id?: string;
  start_date: string;
}

export interface UpdateEmployeeDto {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  gender: Database["public"]["Enums"]["gender"];
  birthday?: string | null;
  employee_code: string;
  department: string;
  branch?: string;
  manager_id: string;
  role?: string;
  position_id?: string;
  start_date: string;
}

export interface EmployeeImportData {
  employee_code: string;
  full_name: string;
  email: string;
  phone_number?: string;
  gender: Database["public"]["Enums"]["gender"];
  birthday?: string;
  department: string;
  department_name?: string;
  branch?: string;
  branch_name?: string;
  start_date?: string;
}

export interface InvalidEmployeeRecord {
  row: number;
  data: any;
  errors: string[];
  fieldErrors: Record<string, string>;
}

export interface ValidateEmployeeFileDto {
  file: File;
}

export interface ValidateEmployeeFileResultDto {
  totalCount: number;
  validCount: number;
  invalidCount: number;
  validRecords: EmployeeImportData[];
  invalidRecords: InvalidEmployeeRecord[];
}

export interface ImportEmployeesDto {
  file: File;
}

export interface ImportEmployeesResultDto {
  successCount: number;
  failedCount: number;
  errors: Array<{
    row: number;
    employeeCode: string;
    error: string;
  }>;
}
