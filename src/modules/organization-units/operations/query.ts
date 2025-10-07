import { useTQuery } from "@/lib/queryClient";
import { organizationUnitsRepository } from "@/repository";

export const useGetOrganizationUnitsQuery = () => {
  return useTQuery({
    queryKey: ["organization-units"],
    queryFn: organizationUnitsRepository.getOrganizationUnits,
  });
};

