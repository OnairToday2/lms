import { supabase } from "@/services";

const getEmployments = async () => {
  const response = await supabase
    .from("employments")
    .select("*, employees(*, profiles(*))");

  return response.data;
};

export {
  getEmployments,
};

