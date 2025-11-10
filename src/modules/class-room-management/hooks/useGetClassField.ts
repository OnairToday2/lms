import { useTQuery } from "@/lib";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { getClassFieldList, getClassHasTagList } from "@/repository/classRoom";

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
export { useGetClassFieldQuery, useGetClassHashTagQuery };
