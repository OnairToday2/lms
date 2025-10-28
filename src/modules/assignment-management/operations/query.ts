import { useTQuery } from "@/lib/queryClient";
import type { GetAssignmentsParams } from "@/types/dto/assignments";
import * as assignmentService from "@/services/assignments/assignment.service";

export const useGetAssignmentsQuery = (params?: GetAssignmentsParams) => {
  return useTQuery({
    queryKey: ["assignments", params],
    queryFn: () => assignmentService.getAssignments(params),
  });
};

export const useGetAssignmentQuery = (id: string) => {
  return useTQuery({
    queryKey: ["assignments", id],
    queryFn: () => assignmentService.getAssignmentById(id),
    enabled: !!id,
  });
};

