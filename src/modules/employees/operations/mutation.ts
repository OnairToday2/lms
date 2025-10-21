import { useTMutation } from "@/lib/queryClient";
import type { CreateEmployeeDto, UpdateEmployeeDto } from "@/types/dto/employees";

export const useCreateEmployeeMutation = () => {
  return useTMutation({
    mutationFn: async (payload: CreateEmployeeDto) => {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create employee");
      }

      return response.json();
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  return useTMutation({
    mutationFn: async (payload: UpdateEmployeeDto) => {
      const response = await fetch(`/api/employees/${payload.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update employee");
      }

      return response.json();
    },
  });
};

export const useDeleteEmployeeMutation = () => {
  return useTMutation({
    mutationFn: async (employeeId: string) => {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete employee");
      }

      return response.json();
    },
  });
};
