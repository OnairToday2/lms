import { useTQuery } from "@/lib";
import { getClassFieldList, getClassHasTagList } from "@/repository/class-room";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { employeeRepository } from "@/repository";
import { EmployeeQueryParams } from "@/repository/employee";

const useGetClassFieldQuery = () => {
  return useTQuery({
    queryFn: getClassFieldList,
    queryKey: [QUERY_KEYS.GET_CLASS_FIELDS],
  });
};
const useGetClassHashTagQuery = () => {
  return useTQuery({
    queryFn: getClassHasTagList,
    queryKey: [QUERY_KEYS.GET_CLASS_HASH_TAGS],
  });
};

const useGetEmployeeQuery = (options?: { enabled?: boolean; queryParams?: EmployeeQueryParams }) => {
  const { enabled, queryParams } = options || {};
  return useTQuery({
    queryKey: [QUERY_KEYS.GET_STUDENTS, queryParams],
    queryFn: () => employeeRepository.getStudents(queryParams),
    enabled,
  });
};
export default useGetEmployeeQuery;

export { useGetClassFieldQuery, useGetClassHashTagQuery };
