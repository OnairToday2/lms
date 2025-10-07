import { supabase } from "@/services";

const getProfiles = async () => {
  const response = await supabase.from("profiles").select("*");

  return response.data;
};

export {
  getProfiles,
};