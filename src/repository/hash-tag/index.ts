import { supabase } from "@/services";
import { CreateClassRoomHashTagPayload } from "./type";

const getHashTags = async () => {
  return await supabase.from("hash_tags").select("*", { count: "exact" });
};

const createClassRoomHashTag = async (payload: CreateClassRoomHashTagPayload) => {
  try {
    return await supabase
      .from("hash_tags")
      .insert({
        ...payload,
        type: "class_room",
      })
      .select("*")
      .single();
  } catch (err) {
    console.log(err);
    throw new Error("Create Classroom hashtag Failed");
  }
};

export { getHashTags, createClassRoomHashTag };
