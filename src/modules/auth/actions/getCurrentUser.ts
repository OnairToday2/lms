import { createSVClient } from "@/services";
export const getCurrentUser = async () => {
  const supabase = await createSVClient();

  const { data, error } = await supabase.auth.getUser();

  return data.user;
};
