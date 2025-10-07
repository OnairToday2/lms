import { supabase } from "@/services";

const getPositions = async () => {
  const response = await supabase.from("positions").select("*");

  return response.data;
};

export {
  getPositions,
};

