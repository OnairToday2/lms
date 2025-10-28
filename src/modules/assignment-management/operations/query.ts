import { useTQuery } from "@/lib/queryClient";
import type { GetAssignmentsParams, AssignmentStudentDto } from "@/types/dto/assignments";
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

export const useGetAssignmentStudentsQuery = (assignmentId: string, enabled: boolean = true) => {
  return useTQuery<AssignmentStudentDto[]>({
    queryKey: ["assignments", assignmentId, "students"],
    queryFn: async () => {
      const response = await fetch(`/api/assignments/${assignmentId}/students`);
      if (!response.ok) {
        throw new Error("Failed to fetch assignment students");
      }
      return response.json();
    },
    enabled: !!assignmentId && enabled,
  });
};

