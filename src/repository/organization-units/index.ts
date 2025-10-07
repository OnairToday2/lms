import { supabase } from "@/services";

const getOrganizationUnits = async () => {
  const response = await supabase.from("organization_units").select("*");

  return response.data;
};

export {
  getOrganizationUnits,
};

