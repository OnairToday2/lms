import { useTQuery } from "@/lib/queryClient";
import { employmentsRepository } from "@/repository";

export const useGetEmploymentsQuery = () => {
  return useTQuery({
    queryKey: ["employments"],
    queryFn: employmentsRepository.getEmployments,
  });
};

