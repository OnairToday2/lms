import { supabase } from "@/services";
import { CreateCoursePayload, UpsertCoursePayload } from "./type";

const createCourse = async (payload: CreateCoursePayload) => {
  try {
    return await supabase.from("courses").insert(payload).select("*").single();
  } catch (err: any) {
    console.log(err);
    throw new Error(err?.message);
  }
};

const upsertCourse = async (upsertPayload: UpsertCoursePayload) => {
  try {
    return await supabase.from("courses").upsert(upsertPayload.payload).select("*").single();
  } catch (err: any) {
    console.log(err);
    throw new Error(err?.message);
  }
};
export { createCourse, upsertCourse };
