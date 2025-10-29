export interface BranchDto {
  id: string;
  name: string;
  organization_id: string;
  parent_id: string | null;
  type: "branch";
  created_at: string;
}
