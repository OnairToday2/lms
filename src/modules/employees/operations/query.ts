import { useTQuery } from "@/lib/queryClient";
import { employeesRepository } from "@/repository";

export const useGetEmployeesQuery = () => {
  return useTQuery({
    queryKey: ["employees"],
    queryFn: employeesRepository.getEmployees,
  });
};