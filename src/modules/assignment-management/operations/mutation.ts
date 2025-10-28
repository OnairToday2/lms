import { useTMutation } from "@/lib/queryClient";
import type { CreateAssignmentDto, UpdateAssignmentDto } from "@/types/dto/assignments";

export const useCreateAssignmentMutation = () => {
  return useTMutation({
    mutationFn: async (payload: CreateAssignmentDto) => {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create assignment");
      }

      return response.json();
    },
  });
};

export const useUpdateAssignmentMutation = () => {
  return useTMutation({
    mutationFn: async (payload: UpdateAssignmentDto) => {
      const response = await fetch(`/api/assignments/${payload.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update assignment");
      }

      return response.json();
    },
  });
};

export const useDeleteAssignmentMutation = () => {
  return useTMutation({
    mutationFn: async (assignmentId: string) => {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete assignment");
      }

      return response.json();
    },
  });
};

