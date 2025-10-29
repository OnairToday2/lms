import { useTQuery } from "@/lib/queryClient";
import type { GetBranchesParams } from "@/types/dto/branches";
import * as branchService from "@/services/branches/branch.service";

export const useGetBranchesQuery = (params?: GetBranchesParams, options?: { enabled?: boolean }) => {
  return useTQuery({
    queryKey: ["branches", params],
    queryFn: () => branchService.getBranches(params),
    enabled: options?.enabled !== false && !!params?.organizationId,
  });
};

export const useGetBranchQuery = (id: string) => {
  return useTQuery({
    queryKey: ["branches", id],
    queryFn: () => branchService.getBranchById(id),
    enabled: !!id,
  });
};
