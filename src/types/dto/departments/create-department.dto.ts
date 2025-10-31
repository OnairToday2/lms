export interface CreateDepartmentDto {
  name: string;
  organization_id: string;
  parent_id?: string | null;
}
