import { hashTagRepository } from "@/repository";
import { useTMutation } from "@/lib";
import { CreateClassRoomHashTagPayload } from "@/repository/hash-tag/type";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-key.constant";
const useCreateHashTagMutation = () => {
  const queryClient = useQueryClient();
  return useTMutation({
    mutationFn: (payload: CreateClassRoomHashTagPayload) => hashTagRepository.createClassRoomHashTag(payload),
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CLASS_HASH_TAGS] });
    },
  });
};
export { useCreateHashTagMutation };
