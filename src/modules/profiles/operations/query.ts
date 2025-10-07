import { useTQuery } from "@/lib/queryClient";
import { profileRepository } from "@/repository";

export const useGetProfilesQuery = () => {
  return useTQuery({
    queryKey: ["profiles"],
    queryFn: profileRepository.getProfiles,
  });
};