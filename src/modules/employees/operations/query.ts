import { useTQuery } from "@/lib/queryClient";
import type { GetEmployeesParams } from "@/types/dto/employees";
import * as employeeService from "@/services/employees/employee.service";

export const useGetEmployeesQuery = (params?: GetEmployeesParams) => {
  return useTQuery({
    queryKey: ["employees", params],
    queryFn: () => employeeService.getEmployees(params),
  });
};

export const useGetEmployeeQuery = (id: string) => {
  return useTQuery({
    queryKey: ["employees", id],
    queryFn: () => employeeService.getEmployeeById(id),
    enabled: !!id,
  });
};