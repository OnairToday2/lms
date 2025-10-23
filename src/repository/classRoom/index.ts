import { ClassRoom } from "@/model/class-room.model";
import { ClassSessionAgenda } from "@/model/class-session-agenda.model";
import { ClassSession } from "@/model/class-session.model";
import { supabase } from "@/services";

const getClassFieldList = async () => {
  return await supabase.from("class_fields").select("*");
};

const getClassHasTagList = async () => {
  return await supabase.from("hash_tags").select("*");
};

type CreateClassRoomPayload = Pick<
  ClassRoom,
  | "description"
  | "comunity_info"
  | "room_type"
  | "slug"
  | "start_at"
  | "end_at"
  | "status"
  | "thumbnail_url"
  | "title"
  | "organization_id"
  | "resource_id"
  | "employee_id"
>;

const createClassRoom = async (payload: CreateClassRoomPayload) => {
  try {
    return await supabase.from("class_rooms").insert(payload).select().single();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Room");
  }
};

type CreatePivotClassRoomAndHashTagPayload = {
  class_room_id: string;
  hash_tag_id: string;
};
const createPivotClassRoomAndHashTag = async (payload: CreatePivotClassRoomAndHashTagPayload[]) => {
  return await supabase.from("class_hash_tag").insert(payload).select("*");
};

type CreatePivotClassRoomAndFieldPayload = {
  class_room_id: string;
  class_field_id: string;
};
const createPivotClassRoomAndField = async (payload: CreatePivotClassRoomAndFieldPayload[]) => {
  try {
    return await supabase.from("class_room_field").insert(payload).select("*");
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Room");
  }
};

type CreateClassRoomSessionsPayload = {
  classRoomId: string;
  sessions: Pick<
    ClassSession,
    | "title"
    | "start_at"
    | "end_at"
    | "description"
    | "limit_person"
    | "is_online"
    | "resource_ids"
    | "channel_info"
    | "channel_provider"
  >[];
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

type CreateAgendasWithSessionPayload = Pick<
  ClassSessionAgenda,
  "title" | "description" | "end_at" | "start_at" | "thumbnail_url" | "class_session_id"
>;
const createAgendasWithSession = async (payload: CreateAgendasWithSessionPayload[]) => {
  try {
    return await supabase.from("class_sessions_agendas").insert(payload).select();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error create Agendas");
  }
};
type CreatePivotClassSessionAndTeacherPayload = {
  class_session_id: string;
  teacher_id: string;
};
const createPivotClassSessionAndTeacher = async (payload: CreatePivotClassSessionAndTeacherPayload[]) => {
  return await supabase.from("class_session_teacher").insert(payload).select();
};

type CreatePivotClassRoomAndEmployeePayload = {
  class_room_id: string;
  employee_id: string;
};
const createPivotClassRoomAndEmployee = async (payload: CreatePivotClassRoomAndEmployeePayload[]) => {
  return await supabase.from("class_room_employee").insert(payload).select();
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
};
export type {
  CreateClassRoomPayload,
  CreateClassRoomSessionsPayload,
  CreatePivotClassSessionAndTeacherPayload,
  CreatePivotClassRoomAndFieldPayload,
  CreatePivotClassRoomAndHashTagPayload,
  CreateAgendasWithSessionPayload,
  CreatePivotClassRoomAndEmployeePayload,
};
