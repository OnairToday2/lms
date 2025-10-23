import { useAuthStore } from "@/modules/auth/store/AuthProvider";
import { useTQuery } from "@/lib/queryClient";
import { createSVClient } from "@/services";

async function getOrganizationIdByUserId(userId: string): Promise<string | null> {
  const supabase = await createSVClient();
  
  const { data, error } = await supabase
    .from("employees")
    .select("organization_id")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching organization ID:", error);
    return null;
  }

  return data?.organization_id || null;
}

export function useOrganizationId() {
  const userId = useAuthStore((state) => state.data?.id);

  const { data: organizationId, isLoading, error } = useTQuery({
    queryKey: ["organization-id", userId],
    queryFn: () => getOrganizationIdByUserId(userId!),
    enabled: !!userId,
  });

  return {
    organizationId,
    isLoading,
    error,
  };
}
