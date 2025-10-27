import { QUERY_KEYS } from "@/constants/query-key.constant";
import { useTMutation } from "@/lib";
import { classFieldRepository } from "@/repository";
import { CreateClassFieldPayload } from "@/repository/class-room-field/type";
import { useQueryClient } from "@tanstack/react-query";

const useCreateClassFieldMutation = () => {
  const queryClient = useQueryClient();
  return useTMutation({
    mutationFn: (payload: CreateClassFieldPayload) => classFieldRepository.createClassField(payload),
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CLASS_FIELDS] });
    },
  });
};
export { useCreateClassFieldMutation };
