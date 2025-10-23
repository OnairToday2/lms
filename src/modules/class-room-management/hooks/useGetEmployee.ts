import { useTQuery } from "@/lib";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { employeeRepository } from "@/repository";
import { EmployeeQueryParams } from "@/repository/employee";
const useGetEmployeeQuery = (options?: { enabled?: boolean; queryParams?: EmployeeQueryParams }) => {
  const { enabled, queryParams } = options || {};
  return useTQuery({
    queryKey: [QUERY_KEYS.GET_STUDENTS, queryParams],
    queryFn: () => employeeRepository.getStudents(queryParams),
    enabled,
  });
};
export default useGetEmployeeQuery;
