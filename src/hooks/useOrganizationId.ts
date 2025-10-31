import { useUserOrganization } from "@/modules/organization/store/UserOrganizationProvider";

export function useOrganizationId() {
  const organizationId = useUserOrganization((state) => state.data.organization.id);
  
  return {
    organizationId,
    isLoading: false,
    error: null,
  };
}
