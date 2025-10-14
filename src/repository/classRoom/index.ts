import { supabase } from "@/services";

const getClassFieldList = async () => {
  return await supabase.from("class_fields").select("*");
};

const getClassHasTagList = async () => {
  return await supabase.from("hash_tags").select("*");
};

export { getClassFieldList, getClassHasTagList };
