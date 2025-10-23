import { supabase } from "@/services";
import {
  CreateClassRoomPayload,
  CreateClassRoomSessionsPayload,
  CreatePivotClassRoomAndHashTagPayload,
  CreatePivotClassRoomAndFieldPayload,
  CreateAgendasWithSessionPayload,
  CreateClassRoomMetaPayload,
  CreatePivotClassSessionAndTeacherPayload,
  GetClassRoomMetaQueryParams,
  CreatePivotClassRoomAndEmployeePayload,
} from "./type";
export * from "./type";

const getClassFieldList = async () => {
  return await supabase.from("class_fields").select("*");
};

const getClassHasTagList = async () => {
  return await supabase.from("hash_tags").select("*");
};

const createClassRoom = async (payload: CreateClassRoomPayload) => {
  try {
    return await supabase.from("class_rooms").insert(payload).select().single();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Room");
  }
};

const createPivotClassRoomAndHashTag = async (payload: CreatePivotClassRoomAndHashTagPayload[]) => {
  return await supabase.from("class_hash_tag").insert(payload).select("*");
};

const createPivotClassRoomAndField = async (payload: CreatePivotClassRoomAndFieldPayload[]) => {
  try {
    return await supabase.from("class_room_field").insert(payload).select("*");
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Room");
  }
};

const createClassSession = async (payload: CreateClassRoomSessionsPayload) => {
  try {
    const sessionInsertPayload = payload.sessions.map((session) => ({
      ...session,
      class_room_id: payload.classRoomId,
    }));
    return await supabase.from("class_sessions").insert(sessionInsertPayload).select();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error craete Sessions");
  }
};

const createAgendasWithSession = async (payload: CreateAgendasWithSessionPayload[]) => {
  try {
    return await supabase.from("class_sessions_agendas").insert(payload).select();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error create Agendas");
  }
};

const createPivotClassSessionAndTeacher = async (payload: CreatePivotClassSessionAndTeacherPayload[]) => {
  try {
    return await supabase.from("class_session_teacher").insert(payload).select();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error create Pivot Session and Teacher");
  }
};

const createPivotClassRoomAndEmployee = async (payload: CreatePivotClassRoomAndEmployeePayload[]) => {
  try {
    return await supabase.from("class_room_employee").insert(payload).select();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error create Class Room and Employee");
  }
};

/**
 * For Class Room Meta data content
 */
const createClassRoomMeta = async (payload: CreateClassRoomMetaPayload[]) => {
  try {
    return await supabase.from("class_room_metadata").insert(payload).select("*");
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Meta");
  }
};

const getClassRoomMeta = async (params: GetClassRoomMetaQueryParams) => {
  const { class_room_id, key } = params;
  if (!class_room_id) throw new Error("Missing class_room_id");

  let classRoomMetaQuery = supabase
    .from("class_room_metadata")
    .select(
      `
        id, 
        value, 
        key, 
        class_rooms!inner(
          id, 
          title
        )
      `,
    )
    .eq("class_rooms.id", class_room_id);
  if (key) {
    classRoomMetaQuery = classRoomMetaQuery.eq("key", key);
  }
  return await classRoomMetaQuery;
};

export {
  getClassFieldList,
  getClassHasTagList,
  createClassRoom,
  createClassSession,
  createPivotClassSessionAndTeacher,
  createPivotClassRoomAndHashTag,
  createPivotClassRoomAndField,
  createAgendasWithSession,
  createPivotClassRoomAndEmployee,
  createClassRoomMeta,
  getClassRoomMeta,
};
