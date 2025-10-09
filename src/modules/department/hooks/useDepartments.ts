import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentRepository } from "@/repository/department";
import {
  DepartmentInsert,
  DepartmentUpdate,
  DepartmentFilters,
  ImportDepartmentRow,
  ImportResult,
} from "../types";

// Query keys
export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (filters?: DepartmentFilters, page?: number, limit?: number) =>
    [...departmentKeys.lists(), filters, page, limit] as const,
  detail: (id: string) => [...departmentKeys.all, "detail", id] as const,
  branches: (organizationId: string) => [...departmentKeys.all, "branches", organizationId] as const,
};

// Hooks for querying departments
export function useDepartments(
  filters?: DepartmentFilters,
  page = 1,
  limit = 10
) {
  return useQuery({
    queryKey: departmentKeys.list(filters, page, limit),
    queryFn: () => departmentRepository.getList(filters, page, limit),
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentRepository.getById(id),
    enabled: !!id,
  });
}

export function useBranches(organizationId: string) {
  return useQuery({
    queryKey: departmentKeys.branches(organizationId),
    queryFn: () => departmentRepository.getBranches(organizationId),
    enabled: !!organizationId,
  });
}

// Hooks for mutating departments
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DepartmentInsert) => departmentRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DepartmentUpdate }) =>
      departmentRepository.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: departmentKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}

export function useCheckDepartmentName() {
  return useMutation({
    mutationFn: ({
      name,
      organizationId,
      branchId,
      excludeId,
    }: {
      name: string;
      organizationId: string;
      branchId: string | null;
      excludeId?: string;
    }) => departmentRepository.checkNameExists(name, organizationId, branchId, excludeId),
  });
}

export function useImportDepartments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      rows,
      organizationId,
      defaultBranchId,
    }: {
      rows: ImportDepartmentRow[];
      organizationId: string;
      defaultBranchId?: string;
    }): Promise<ImportResult> => {
      const errors: ImportResult["errors"] = [];

      // Get all branches if branch names are specified
      const branches = await departmentRepository.getBranches(organizationId);
      const branchMap = new Map(branches.map(b => [b.name.toLowerCase(), b.id]));

      // Validate each row
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2;

        // Validate name
        if (!row.name || row.name.trim() === "") {
          errors.push({
            row: rowNumber,
            field: "name",
            message: "Tên phòng ban không được để trống",
          });
        } else if (row.name.length > 100) {
          errors.push({
            row: rowNumber,
            field: "name",
            message: "Tên phòng ban không được vượt quá 100 ký tự",
          });
        } else {
          // Determine branch ID
          let branchId = defaultBranchId || null;
          if (row.branchName) {
            branchId = branchMap.get(row.branchName.toLowerCase()) || null;
            if (!branchId) {
              errors.push({
                row: rowNumber,
                field: "branchName",
                message: `Chi nhánh "${row.branchName}" không tồn tại`,
              });
              continue;
            }
          }

          // Check if name already exists in the branch
          const nameExists = await departmentRepository.checkNameExists(
            row.name,
            organizationId,
            branchId
          );
          if (nameExists) {
            errors.push({
              row: rowNumber,
              field: "name",
              message: `Tên phòng ban "${row.name}" đã tồn tại trong chi nhánh`,
            });
          }
        }
      }

      // If there are validation errors, return them
      if (errors.length > 0) {
        return {
          success: false,
          created: 0,
          errors,
        };
      }

      // Convert rows to DepartmentInsert format
      const departmentsToInsert: DepartmentInsert[] = rows.map((row) => {
        let branchId = defaultBranchId || null;
        if (row.branchName) {
          branchId = branchMap.get(row.branchName.toLowerCase()) || null;
        }
        
        return {
          name: row.name,
          organization_id: organizationId,
          parent_id: branchId,
          type: "department" as const,
        };
      });

      // Bulk insert
      const createdDepartments = await departmentRepository.bulkImport(
        departmentsToInsert
      );

      return {
        success: true,
        created: createdDepartments.length,
        errors: [],
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}
