import { Database, Tables } from "@/types/supabase.types";

export type OrganizationUnit = Tables<"organization_units">;
export type OrganizationUnitType = Database["public"]["Enums"]["organization_unit_type"];

export type OrganizationUnitDepartment = Omit<OrganizationUnit, "type"> & {
  type: "department";
};

export type OrganizationUnitBranch = Omit<OrganizationUnit, "type"> & {
  type: "branch";
};
