import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";

export type Department = Tables<"organization_units">;
export type DepartmentInsert = TablesInsert<"organization_units">;
export type DepartmentUpdate = TablesUpdate<"organization_units">;

export interface DepartmentFormData {
  name: string;
  organization_id: string;
  parent_id: string | null;
}

export interface DepartmentFilters {
  search?: string;
  organizationId?: string;
  branchId?: string;
}

export interface ImportDepartmentRow {
  name: string;
  branchName?: string;
}

export interface ImportValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ImportResult {
  success: boolean;
  created: number;
  errors: ImportValidationError[];
}
