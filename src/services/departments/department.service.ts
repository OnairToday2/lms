import type {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  GetDepartmentsParams,
  DepartmentDto,
  ImportDepartmentsDto,
  DepartmentImportResult,
} from "@/types/dto/departments";
import type { PaginatedResult } from "@/types/dto/pagination.dto";
import { departmentRepository } from "@/repository/department";

async function getDepartments(params?: GetDepartmentsParams): Promise<PaginatedResult<DepartmentDto>> {
  return departmentRepository.getList(params);
}

async function getDepartmentById(id: string): Promise<DepartmentDto> {
  return departmentRepository.getById(id);
}

async function createDepartment(payload: CreateDepartmentDto): Promise<DepartmentDto> {
  // Check if name already exists in the same branch
  const exists = await departmentRepository.checkNameExists(
    payload.name,
    payload.organization_id,
    payload.parent_id || null
  );

  if (exists) {
    throw new Error("Tên phòng ban đã tồn tại trong chi nhánh này");
  }

  return departmentRepository.create(payload);
}

async function updateDepartment(payload: UpdateDepartmentDto): Promise<DepartmentDto> {
  // Check if name already exists (excluding current department)
  if (payload.name) {
    const department = await departmentRepository.getById(payload.id);
    const branchId = payload.parent_id !== undefined ? payload.parent_id : department.parent_id;
    const exists = await departmentRepository.checkNameExists(
      payload.name,
      department.organization_id,
      branchId,
      payload.id
    );

    if (exists) {
      throw new Error("Tên phòng ban đã tồn tại trong chi nhánh này");
    }
  }

  return departmentRepository.update(payload);
}

async function deleteDepartment(id: string): Promise<void> {
  return departmentRepository.delete(id);
}

async function getBranches(organizationId: string) {
  const branches = await departmentRepository.getBranches(organizationId);
  return { data: branches };
}

async function importDepartments(payload: ImportDepartmentsDto): Promise<DepartmentImportResult> {
  const { departments, organizationId } = payload;
  const errors: string[] = [];
  const validDepartments: CreateDepartmentDto[] = [];

  // Get all branches for lookup
  const branches = await departmentRepository.getBranches(organizationId);
  const branchMap = new Map(branches.map((b) => [b.name.toLowerCase(), b.id]));

  // Validate each department
  for (let i = 0; i < departments.length; i++) {
    const dept = departments[i];
    if (!dept) continue;
    
    const rowNumber = i + 2; // +2 because of header row and 0-index

    if (!dept.name || dept.name.trim() === "") {
      errors.push(`Dòng ${rowNumber}: Tên phòng ban không được để trống`);
      continue;
    }

    // Find branch ID if branch_name is provided
    let branchId: string | null = null;
    if (dept.branch_name && dept.branch_name.trim() !== "") {
      branchId = branchMap.get(dept.branch_name.toLowerCase()) || null;
      if (!branchId) {
        errors.push(`Dòng ${rowNumber}: Không tìm thấy chi nhánh "${dept.branch_name}"`);
        continue;
      }
    }

    // Check for duplicates in the import file (same name in same branch)
    const duplicateInFile = validDepartments.find(
      (d) =>
        d.name.toLowerCase() === dept.name.toLowerCase() &&
        d.parent_id === branchId
    );
    if (duplicateInFile) {
      errors.push(`Dòng ${rowNumber}: Tên phòng ban "${dept.name}" bị trùng trong file`);
      continue;
    }

    // Check if name already exists in database (in the same branch)
    const exists = await departmentRepository.checkNameExists(
      dept.name,
      organizationId,
      branchId
    );
    if (exists) {
      const branchText = dept.branch_name ? ` trong chi nhánh "${dept.branch_name}"` : "";
      errors.push(`Dòng ${rowNumber}: Tên phòng ban "${dept.name}"${branchText} đã tồn tại`);
      continue;
    }

    validDepartments.push({
      name: dept.name,
      organization_id: organizationId,
      parent_id: branchId,
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

  // Import valid departments
  try {
    await departmentRepository.bulkImport(validDepartments);
    return {
      success: true,
      imported: validDepartments.length,
      failed: 0,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      imported: 0,
      failed: validDepartments.length,
      errors: [`Lỗi khi import: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}

export {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getBranches,
  importDepartments,
};
