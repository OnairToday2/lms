import { supabase } from "@/services";
import { CreateClassFieldPayload } from "./type";

const getClassFields = async () => {
  return await supabase.from("class_fields").select("*", { count: "exact" });
};

const crateClasField = async (payload: CreateClassFieldPayload) => {
  try {
    return await supabase.from("class_fields").insert(payload).select("*").single();
  } catch (err) {
    console.log(err);
    throw new Error("Create Class Field Failed");
  }
};

export { crateClasField, getClassFields };
