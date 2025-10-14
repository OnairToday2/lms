import { useTQuery } from "@/lib";
import { getClassFieldList, getClassHasTagList } from "@/repository/classRoom";
import { queryKeys } from "@/constants/query-key.constant";

const useGetClassFieldQuery = () => {
  return useTQuery({
    queryFn: getClassFieldList,
    queryKey: [queryKeys.GET_CLASS_FIELDS],
  });
};
const useGetClassHashTagQuery = () => {
  return useTQuery({
    queryFn: getClassHasTagList,
    queryKey: [queryKeys.GET_CLASS_HASH_TAGS],
  });
};
export { useGetClassFieldQuery, useGetClassHashTagQuery };
