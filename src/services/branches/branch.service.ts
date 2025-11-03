import type {
  CreateBranchDto,
  UpdateBranchDto,
  GetBranchesParams,
  BranchDto,
  ImportBranchesDto,
  BranchImportResult,
} from "@/types/dto/branches";
import type { PaginatedResult } from "@/types/dto/pagination.dto";
import { branchRepository } from "@/repository/branch";

async function getBranches(params?: GetBranchesParams): Promise<PaginatedResult<BranchDto>> {
  return branchRepository.getList(params);
}

async function getBranchById(id: string): Promise<BranchDto> {
  return branchRepository.getById(id);
}

async function createBranch(payload: CreateBranchDto): Promise<BranchDto> {
  // Check if name already exists
  const exists = await branchRepository.checkNameExists(
    payload.name,
    payload.organization_id
  );

  if (exists) {
    throw new Error("Tên chi nhánh đã tồn tại");
  }

  return branchRepository.create(payload);
}

async function updateBranch(payload: UpdateBranchDto): Promise<BranchDto> {
  // Check if name already exists (excluding current branch)
  if (payload.name) {
    const branch = await branchRepository.getById(payload.id);
    const exists = await branchRepository.checkNameExists(
      payload.name,
      branch.organization_id,
      payload.id
    );

    if (exists) {
      throw new Error("Tên chi nhánh đã tồn tại");
    }
  }

  return branchRepository.update(payload);
}

async function deleteBranch(id: string): Promise<void> {
  return branchRepository.delete(id);
}

async function importBranches(payload: ImportBranchesDto): Promise<BranchImportResult> {
  const { branches, organizationId } = payload;
  const errors: string[] = [];
  const validBranches: CreateBranchDto[] = [];

  // Validate each branch
  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];
    if (!branch) continue;
    
    const rowNumber = i + 2; // +2 because of header row and 0-index

    if (!branch.name || branch.name.trim() === "") {
      errors.push(`Dòng ${rowNumber}: Tên chi nhánh không được để trống`);
      continue;
    }

    if (!branch.code || branch.code.trim() === "") {
      errors.push(`Dòng ${rowNumber}: Mã chi nhánh không được để trống`);
      continue;
    }

    if (!branch.address || branch.address.trim() === "") {
      errors.push(`Dòng ${rowNumber}: Địa điểm không được để trống`);
      continue;
    }

    // Check for duplicates in the import file
    const duplicateInFile = validBranches.find(
      (b) => b.name.toLowerCase() === branch.name.toLowerCase()
    );
    if (duplicateInFile) {
      errors.push(`Dòng ${rowNumber}: Tên chi nhánh "${branch.name}" bị trùng trong file`);
      continue;
    }

    // Check if name already exists in database
    const exists = await branchRepository.checkNameExists(
      branch.name,
      organizationId
    );
    if (exists) {
      errors.push(`Dòng ${rowNumber}: Tên chi nhánh "${branch.name}" đã tồn tại`);
      continue;
    }

    validBranches.push({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      organization_id: organizationId,
    });
  }

  // If there are errors, return them without importing
  if (errors.length > 0) {
    return {
      success: false,
      imported: 0,
      failed: errors.length,
      errors,
    };
  }

  // Import valid branches
  try {
    await branchRepository.bulkImport(validBranches);
    return {
      success: true,
      imported: validBranches.length,
      failed: 0,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      imported: 0,
      failed: validBranches.length,
      errors: [`Lỗi khi import: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}

export {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  importBranches,
};
