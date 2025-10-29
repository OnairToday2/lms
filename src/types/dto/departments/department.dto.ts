export interface DepartmentDto {
  id: string;
  name: string;
  organization_id: string;
  parent_id: string | null;
  type: "department";
  created_at: string;
  branch?: {
    id: string;
    name: string;
  } | null;
}
