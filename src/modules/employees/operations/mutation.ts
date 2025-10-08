import { useTMutation } from "@/lib/queryClient";
import { employeesRepository } from "@/repository";
import type { CreateEmployeePayload } from "@/repository/employees";

export const useCreateEmployeeMutation = () => {
  return useTMutation({
    mutationFn: (payload: CreateEmployeePayload) =>
      employeesRepository.createEmployee(payload),
  });
};
