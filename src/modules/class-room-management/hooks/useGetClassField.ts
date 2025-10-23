import { useTQuery } from "@/lib";
import { classRoomRepository } from "@/repository";
import { queryKeys } from "@/constants/query-key.constant";

const useGetClassFieldQuery = () => {
  return useTQuery({
    queryFn: classRoomRepository.getClassFieldList,
    queryKey: [queryKeys.GET_CLASS_FIELDS],
  });
};
const useGetClassHashTagQuery = () => {
  return useTQuery({
    queryFn: classRoomRepository.getClassHasTagList,
    queryKey: [queryKeys.GET_CLASS_HASH_TAGS],
  });
};
export { useGetClassFieldQuery, useGetClassHashTagQuery };

