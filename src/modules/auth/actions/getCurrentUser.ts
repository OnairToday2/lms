import { createSVClient } from "@/services";

export const getCurrentUser = async () => {
  const supabase = await createSVClient();
  const { data, error } = await supabase.auth.getUser();
  return data.user;
};

export const ensureGetCurrentUser = async () => {
  const supabase = await createSVClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  return data.user;
};
