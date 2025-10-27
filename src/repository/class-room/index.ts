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
  UpSertClassRoomPayload,
  UpSertClassRoomMetaPayload,
} from "./type";
import { ClassRoomMetaKey, ClassRoomMetaValue } from "@/constants/class-room-meta.constant";
export * from "./type";

const getClassRoomById = async (classRoomId: string) => {
  try {
    const { data, error } = await supabase
      .from("class_rooms")
      .select(
        `
          id, 
          title,
          slug,
          description,
          room_type,
          comunity_info,
          thumbnail_url,
          start_at,
          end_at,
          status,
          employee_id,
          class_room_metadata(id, key, value, class_room_id),
          class_hash_tag(
            id,
            hash_tags(
              id, name, slug, type
            )
          ),
          class_room_field(
            id,
            class_fields(
              id, name, slug
            )
          ),
          employees:class_room_employee(
            id,
            employee:employees(
              id,
              employee_type,
              employee_code,
              profile:profiles(
                id,
                full_name,
                email,
                employee_id,
                avatar
              )
            )
          ),
          owner:employees(
            id,
            employee_type,
            employee_code,
            profile:profiles(
              id,
              full_name,
              email,
              employee_id,
              avatar
            )
          ),
          organizations(
            id, 
            name
          ),
          sessions:class_sessions(
            id,
            title,
            description,
            start_at,
            end_at,
            class_room_id,
            is_online,
            channel_provider,
            channel_info,
            limit_person,
            teachers:class_session_teacher(
              id,
              employee:employees!class_session_teacher_teacher_id_fkey(
                id,
                employee_type,
                employee_code,
                profile:profiles(
                  id,
                  full_name,
                  email,
                  employee_id,
                  avatar
                )
              )
            ),
            agendas:class_sessions_agendas(
              id,
              title,
              description,
              thumbnail_url,
              start_at,
              end_at,
              class_session_id
            ),
            metadata:class_session_metadata(
              id,
              class_session_id,
              key,
              value
            )
          )
      `,
      )
      .eq("id", classRoomId)
      .single()
      .overrideTypes<{
        class_room_metadata: {
          class_room_id: string;
          id: string;
          key: ClassRoomMetaKey;
          value: ClassRoomMetaValue;
        }[];
        comunity_info: { name: string; url: string };
        sessions: {
          channel_info: {
            providerId: string;
            url: string;
            password: string;
          };
        }[];
      }>();
    return { data, error };
  } catch (err: any) {
    throw new Error(err?.message ?? "Fetching ClassRoom Detail failed not found");
  }
};
export type GetClassRoomByIdResponse = Awaited<ReturnType<typeof getClassRoomById>>;

const createClassRoom = async (payload: CreateClassRoomPayload) => {
  try {
    return await supabase.from("class_rooms").insert(payload).select().single();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Room");
  }
};

const upsertClassRoom = async (payload: UpSertClassRoomPayload) => {
  try {
    return await supabase.from("class_rooms").upsert(payload).select().single();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Room");
  }
};

const createPivotClassRoomAndHashTag = async (payload: CreatePivotClassRoomAndHashTagPayload[]) => {
  try {
    return await supabase.from("class_hash_tag").insert(payload).select("*");
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete hash tag");
  }
};

const deletePivotClassRoomAndHashTag = async (ids: string[]) => {
  try {
    return await supabase.from("class_hash_tag").delete().in("id", ids);
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete hash tag");
  }
};

const createPivotClassRoomAndField = async (payload: CreatePivotClassRoomAndFieldPayload[]) => {
  try {
    return await supabase.from("class_room_field").insert(payload).select("*");
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Room");
  }
};

const deletePivotClassRoomAndField = async (ids: string[]) => {
  try {
    return await supabase.from("class_room_field").delete().in("id", ids);
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Room");
  }
};

// /**
//  *
//  * CLASS ROOM SESSION
//  *
//  */
// const createClassSession = async (payload: CreateClassRoomSessionsPayload) => {
//   try {
//     const sessionInsertPayload = payload.sessions.map((session) => ({
//       ...session,
//       class_room_id: payload.classRoomId,
//     }));
//     return await supabase.from("class_sessions").insert(sessionInsertPayload).select();
//   } catch (err: any) {
//     console.error("Unexpected error:", err);
//     throw new Error(err.message ?? "Unknown error craete Sessions");
//   }
// };

// const deleteClassSession = async (ids: string[]) => {
//   try {
//     return await supabase.from("class_sessions").delete().in("id", ids);
//   } catch (err: any) {
//     console.error("Unexpected error:", err);
//     throw new Error(err.message ?? "Unknown error Delete Sessions");
//   }
// };

// const createAgendasWithSession = async (payload: CreateAgendasWithSessionPayload[]) => {
//   try {
//     return await supabase.from("class_sessions_agendas").insert(payload).select();
//   } catch (err: any) {
//     console.error("Unexpected error:", err);
//     throw new Error(err.message ?? "Unknown error create Agendas");
//   }
// };

// const createPivotClassSessionAndTeacher = async (payload: CreatePivotClassSessionAndTeacherPayload[]) => {
//   try {
//     return await supabase.from("class_session_teacher").insert(payload).select();
//   } catch (err: any) {
//     console.error("Unexpected error:", err);
//     throw new Error(err.message ?? "Unknown error create Pivot Session and Teacher");
//   }
// };

const createPivotClassRoomAndEmployee = async (payload: CreatePivotClassRoomAndEmployeePayload[]) => {
  try {
    return await supabase.from("class_room_employee").insert(payload).select();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error create Class Room and Employee");
  }
};

const deletePivotClassRoomAndEmployee = async (ids: number[]) => {
  try {
    return await supabase.from("class_room_employee").delete().in("id", ids);
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error create Class Room and Employee");
  }
};

/**
 * For Class Room Meta data content
 */
const createClassRoomMeta = async <K extends ClassRoomMetaKey>(payload: CreateClassRoomMetaPayload<K>) => {
  try {
    return await supabase
      .from("class_room_metadata")
      .insert({ class_room_id: payload.class_room_id, value: payload.value, key: payload.key })
      .select("*")
      .single()
      .overrideTypes<{ key: Exclude<K, undefined> }>();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Meta");
  }
};

const upsertClassRoomMeta = async <K extends ClassRoomMetaKey>(payload: UpSertClassRoomMetaPayload<K>) => {
  try {
    return await supabase
      .from("class_room_metadata")
      .upsert(payload)
      .select("*")
      .single()
      .overrideTypes<{ key: Exclude<K, undefined> }>();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Meta");
  }
};

const getClassRoomMeta = async <K extends ClassRoomMetaKey>(params: GetClassRoomMetaQueryParams<K>) => {
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
  return await classRoomMetaQuery.overrideTypes<
    Array<{
      key: Exclude<K, undefined>;
      value: ClassRoomMetaValue<K>;
    }>
  >();
};

export {
  createClassRoom,
  // createClassSession,
  // deleteClassSession,
  // createPivotClassSessionAndTeacher,
  createPivotClassRoomAndHashTag,
  createPivotClassRoomAndField,
  deletePivotClassRoomAndField,
  // createAgendasWithSession,
  createPivotClassRoomAndEmployee,
  createClassRoomMeta,
  upsertClassRoom,
  upsertClassRoomMeta,
  deletePivotClassRoomAndHashTag,
  getClassRoomMeta,
  getClassRoomById,
  deletePivotClassRoomAndEmployee,
};
