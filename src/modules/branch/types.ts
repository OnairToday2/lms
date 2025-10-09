import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";

export type Branch = Tables<"organization_units">;
export type BranchInsert = TablesInsert<"organization_units">;
export type BranchUpdate = TablesUpdate<"organization_units">;

export interface BranchFormData {
  name: string;
  organization_id: string;
}

export interface BranchFilters {
  search?: string;
  organizationId?: string;
}

export interface ImportBranchRow {
  name: string;
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
