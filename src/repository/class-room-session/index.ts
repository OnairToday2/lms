import { supabase } from "@/services";
import {
  CreateClassRoomSessionsPayload,
  CreateAgendasWithSessionPayload,
  CreatePivotClassRoomSessionAndTeacherPayload,
} from "./type";
export * from "./type";

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

const deleteClassSession = async (ids: string[]) => {
  try {
    return await supabase.from("class_sessions").delete().in("id", ids);
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error Delete Sessions");
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

const createPivotClassSessionAndTeacher = async (payload: CreatePivotClassRoomSessionAndTeacherPayload[]) => {
  try {
    return await supabase.from("class_session_teacher").insert(payload).select();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error create Pivot Session and Teacher");
  }
};

const deletePivotClassSessionAndTeacher = async (ids: string[]) => {
  try {
    return await supabase.from("class_session_teacher").delete().in("id", ids).select("id, name, employee_code");
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error create Agendas");
  }
};

export {
  createClassSession,
  deleteClassSession,
  createPivotClassSessionAndTeacher,
  createAgendasWithSession,
  deletePivotClassSessionAndTeacher,
};
