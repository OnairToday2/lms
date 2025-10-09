import { useTQuery } from "@/lib/queryClient";
import { employeesRepository } from "@/repository";

export const useGetEmployeesQuery = () => {
  return useTQuery({
    queryKey: ["employees"],
    queryFn: employeesRepository.getEmployees,
  });
};

export const useGetEmployeeQuery = (id: string) => {
  return useTQuery({
    queryKey: ["employees", id],
    queryFn: () => employeesRepository.getEmployeeById(id),
    enabled: !!id,
  });
};