import { useTMutation } from "@/lib/queryClient";
import { employeesRepository } from "@/repository";
import type { CreateEmployeePayload, UpdateEmployeePayload } from "@/repository/employees";

export const useCreateEmployeeMutation = () => {
  return useTMutation({
    mutationFn: (payload: CreateEmployeePayload) =>
      employeesRepository.createEmployee(payload),
  });
};

export const useUpdateEmployeeMutation = () => {
  return useTMutation({
    mutationFn: (payload: UpdateEmployeePayload) =>
      employeesRepository.updateEmployee(payload),
  });
};
