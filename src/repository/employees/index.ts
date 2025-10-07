import { supabase } from "@/services";

const getEmployees = async () => {
  const response = await supabase.from("profiles").select("*");

  return response.data;
};

export {
  getEmployees,
};