import { hashTagRepository } from "@/repository";
import { useTMutation } from "@/lib";
import { CreateClassRoomHashTagPayload } from "@/repository/hash-tag/type";

const useCreateHashTagMutation = () => {
  return useTMutation({
    mutationFn: (payload: CreateClassRoomHashTagPayload) => hashTagRepository.createClassRoomHashTag(payload),
  });
};
export { useCreateHashTagMutation };
