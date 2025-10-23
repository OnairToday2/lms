import { useTQuery } from "@/lib";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { teacherRepository } from "@/repository";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { GetTeacherQueryParams } from "@/repository/teacher";

const tryCatchSupabaseData = async <T>(promise: Promise<PostgrestSingleResponse<T>>) => {
  try {
    const { error, data } = await promise;
    if (data) {
      return Promise.resolve(data);
    }
    if (error) {
      return Promise.reject({
        ...error,
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Network fail");
  }
};
const useGetTeachersQuery = (options?: { enabled?: boolean; queryParams?: GetTeacherQueryParams }) => {
  const { enabled, queryParams } = options || {};
  return useTQuery({
    queryKey: [QUERY_KEYS.GET_TEACHERS, queryParams],
    queryFn: () => teacherRepository.getTeacherList(queryParams),
    enabled,
  });
};
export { useGetTeachersQuery };
