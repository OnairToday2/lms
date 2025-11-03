export interface UpdateDepartmentDto {
  id: string;
  name?: string;
  parent_id?: string | null;
}
