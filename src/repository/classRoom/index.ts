import { ClassRoom } from "@/model/class-room.model";
import { ClassSession } from "@/model/class-session.model";
import { supabase } from "@/services";

const getClassFieldList = async () => {
  return await supabase.from("class_fields").select("*");
};

const getClassHasTagList = async () => {
  return await supabase.from("hash_tags").select("*");
};

export interface CreateClassRoomPayload {
  slug: ClassRoom["slug"];
  title: ClassRoom["title"];
  status: ClassRoom["status"];
  comunity_info: ClassRoom["comunity_info"];
  description: ClassRoom["description"];
  room_type: ClassRoom["room_type"];
  user_id: ClassRoom["user_id"];
  thumbnail_url: ClassRoom["thumbnail_url"];
}
const createClassRoom = async (payload: CreateClassRoomPayload) => {
  return await supabase.from("class_rooms").insert(payload).select();
};

export interface CreateClassSessionPayload {
  title: ClassSession["title"];
  channel_info: ClassSession["channel_info"];
  channel_provider: ClassSession["channel_provider"];
  description: ClassSession["description"];
  start_at: ClassSession["start_at"];
  end_at: ClassSession["end_at"];
  is_online: ClassSession["is_online"];
  limit_person: ClassSession["limit_person"];
}

const createClassSession = async (classRoomId: string, payload: CreateClassSessionPayload) => {
  return await supabase
    .from("class_sessions")
    .insert({
      class_room_id: classRoomId,
      ...payload,
    })
    .select();
};
export { getClassFieldList, getClassHasTagList, createClassRoom, createClassSession };
