import { useTQuery } from "@/lib/queryClient";
import type { GetAssignmentsParams, AssignmentStudentDto, AssignmentQuestionDto, SubmissionDetailDto, MyAssignmentDto } from "@/types/dto/assignments";
import * as assignmentService from "@/services/assignments/assignment.service";
import { GET_ASSIGNMENTS } from "@/modules/assignment-management/operations/key";

export const useGetAssignmentsQuery = (params?: GetAssignmentsParams) => {
  return useTQuery({
    queryKey: [GET_ASSIGNMENTS, params],
    queryFn: () => assignmentService.getAssignments(params),
  });
};

export const useGetAssignmentQuery = (id: string) => {
  return useTQuery({
    queryKey: [GET_ASSIGNMENTS, id],
    queryFn: () => assignmentService.getAssignmentById(id),
    enabled: !!id,
  });
};

export const useGetAssignmentStudentsQuery = (assignmentId: string, enabled: boolean = true) => {
  return useTQuery<AssignmentStudentDto[]>({
    queryKey: [GET_ASSIGNMENTS, assignmentId, "students"],
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

export const useGetAssignmentQuestionsQuery = (assignmentId: string) => {
  return useTQuery<AssignmentQuestionDto[]>({
    queryKey: [GET_ASSIGNMENTS, assignmentId, "questions"],
    queryFn: async () => {
      const response = await fetch(`/api/assignments/${assignmentId}/questions`);
      if (!response.ok) {
        throw new Error("Failed to fetch assignment questions");
      }
      return response.json();
    },
    enabled: !!assignmentId,
  });
};

export const useGetSubmissionDetailQuery = (assignmentId: string, employeeId: string) => {
  return useTQuery<SubmissionDetailDto>({
    queryKey: [GET_ASSIGNMENTS, assignmentId, "grade", employeeId],
    queryFn: async () => {
      const response = await fetch(`/api/assignments/${assignmentId}/grade/${employeeId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch submission detail");
      }
      return response.json();
    },
    enabled: !!assignmentId && !!employeeId,
  });
};

export const useGetMyAssignmentsQuery = () => {
  return useTQuery<MyAssignmentDto[]>({
    queryKey: [GET_ASSIGNMENTS, "my-assignments"],
    queryFn: async () => {
      const response = await fetch("/api/my-assignments");
      if (!response.ok) {
        throw new Error("Failed to fetch my assignments");
      }
      return response.json();
    },
  });
};
