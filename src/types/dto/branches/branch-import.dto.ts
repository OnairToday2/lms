export interface BranchImportRow {
  name: string;
}

export interface ImportBranchesDto {
  branches: BranchImportRow[];
  organizationId: string;
}

export interface BranchImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
}
