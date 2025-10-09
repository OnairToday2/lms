import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { branchRepository } from "@/repository/branch";
import {
  BranchInsert,
  BranchUpdate,
  BranchFilters,
  ImportBranchRow,
  ImportResult,
} from "../types";

// Query keys
export const branchKeys = {
  all: ["branches"] as const,
  lists: () => [...branchKeys.all, "list"] as const,
  list: (filters?: BranchFilters, page?: number, limit?: number) =>
    [...branchKeys.lists(), filters, page, limit] as const,
  detail: (id: string) => [...branchKeys.all, "detail", id] as const,
};

// Hooks for querying branches
export function useBranches(
  filters?: BranchFilters,
  page = 1,
  limit = 10
) {
  return useQuery({
    queryKey: branchKeys.list(filters, page, limit),
    queryFn: () => branchRepository.getList(filters, page, limit),
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: branchKeys.detail(id),
    queryFn: () => branchRepository.getById(id),
    enabled: !!id,
  });
}

// Hooks for mutating branches
export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BranchInsert) => branchRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BranchUpdate }) =>
      branchRepository.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: branchKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
    },
  });
}

export function useCheckBranchName() {
  return useMutation({
    mutationFn: ({
      name,
      organizationId,
      excludeId,
    }: {
      name: string;
      organizationId: string;
      excludeId?: string;
    }) => branchRepository.checkNameExists(name, organizationId, excludeId),
  });
}

export function useImportBranches() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      rows,
      organizationId,
    }: {
      rows: ImportBranchRow[];
      organizationId: string;
    }): Promise<ImportResult> => {
      const errors: ImportResult["errors"] = [];

      // Validate each row
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2; // +2 because row 1 is header and array is 0-indexed

        // Validate name
        if (!row.name || row.name.trim() === "") {
          errors.push({
            row: rowNumber,
            field: "name",
            message: "Tên chi nhánh không được để trống",
          });
        } else if (row.name.length > 100) {
          errors.push({
            row: rowNumber,
            field: "name",
            message: "Tên chi nhánh không được vượt quá 100 ký tự",
          });
        } else {
          // Check if name already exists
          const nameExists = await branchRepository.checkNameExists(
            row.name,
            organizationId
          );
          if (nameExists) {
            errors.push({
              row: rowNumber,
              field: "name",
              message: `Tên chi nhánh "${row.name}" đã tồn tại`,
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

      // Convert rows to BranchInsert format
      const branchesToInsert: BranchInsert[] = rows.map((row) => ({
        name: row.name,
        organization_id: organizationId,
      }));

      // Bulk insert
      const createdBranches = await branchRepository.bulkImport(
        branchesToInsert
      );

      return {
        success: true,
        created: createdBranches.length,
        errors: [],
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
    },
  });
}
