import { ClassRoom } from "@/model/class-room.model";
import { ClassSessionAgenda } from "@/model/class-session-agenda.model";
import { ClassSession } from "@/model/class-session.model";
import {
  GetClassRoomsQueryInput,
  GetClassRoomStatusCountsInput,
  GetClassRoomStudentsQueryInput,
} from "@/modules/class-room-management/operations/query";
import { supabase } from "@/services";
import { ClassRoomPriorityDto, ClassRoomSessionDetailDto, ClassRoomStatusCountDto, ClassRoomStudentDto } from "@/types/dto/classRooms/classRoom.dto";
import { PaginatedResult } from "@/types/dto/pagination.dto";
import type { Database } from "@/types/supabase.types";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CLASS_ROOM_STUDENTS_SELECT, CLASS_ROOMS_SELECT, CLASS_SESSION_WITH_CLASS_ROOM_SELECT, LIMIT, PAGE } from "./constants";
import { ClassRoomRuntimeStatus, ClassRoomStatus, ClassRoomType, ClassSessionMode } from "./type";

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

type DeletePivotClassRoomAndEmployeePayload = {
  class_room_id: string;
  employeeIds: string[];
};
const deletePivotClassRoomAndEmployee = async (payload: DeletePivotClassRoomAndEmployeePayload) => {
  const { error } = await supabase
    .from("class_room_employee")
    .delete()
    .eq("class_room_id", payload.class_room_id)
    .in("employee_id", payload.employeeIds)
    .select();

  if (error) {
    throw new Error(`Failed to delete user in classRoom: ${error.message}`);
  }
};


const sanitizeSearchTerm = (value: string) =>
  value.replace(/%/g, "\\%").replace(/_/g, "\\_").replace(/,/g, " ");

const applyClassRoomFilters = <
  T extends PostgrestFilterBuilder<any, any, any, any>,
>(
  query: T,
  filters: GetClassRoomsQueryInput = {},
): T => {
  const { status, runtimeStatus, from, to, q, type, sessionMode } = filters;
  let builder = query;

  if (status && status !== ClassRoomStatus.All) {
    builder = builder.eq("status", status);
  }

  if (type && type !== ClassRoomType.All) {
    builder = builder.eq("room_type", type);
  }

  if (runtimeStatus && runtimeStatus !== ClassRoomRuntimeStatus.All) {
    builder = builder.eq("runtime_status", runtimeStatus);
  }

  if (sessionMode && sessionMode !== ClassSessionMode.All) {
    const isOnline = sessionMode === ClassSessionMode.Online;
    builder = builder.eq("class_sessions.is_online", isOnline);
  }

  if (from) {
    builder = builder.gte("computed_end_at", from);
  }

  if (to) {
    builder = builder.lte("computed_start_at", to);
  }

  if (q) {
    const trimmed = q.trim();
    if (trimmed) {
      const escaped = sanitizeSearchTerm(trimmed);
      builder = builder.or(
        [
          `title.ilike.%${escaped}%`,
          `description.ilike.%${escaped}%`,
        ].join(","),
      );
    }
  }

  return builder;
};

const createClassRoomsQuery = (
  filters: { organizationId?: string | null; employeeId?: string | null },
  select: string,
  options?: { count?: "exact" | "planned" | "estimated"; head?: boolean },
) => {
  const { organizationId, employeeId } = filters;
  let query = supabase
    .from("class_rooms_priority")
    .select(select, options)
    .not("status", "in", "(deleted)")

  if (organizationId) {
    query = query.eq("organization_id", organizationId!);
  }

  if (employeeId) {
    query = query.eq("employee_id", employeeId);
  }

  return query;
};


const getClassRooms = async (
  input: GetClassRoomsQueryInput = {},
): Promise<PaginatedResult<ClassRoomPriorityDto>> => {
  const {
    page = PAGE,
    limit = LIMIT,
    runtimeStatus: statusFilter,
    status,
    q,
    from,
    to,
    organizationId,
    employeeId,
    orderBy,
    orderField,
    type,
    sessionMode,
  } = input;

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;
  const rangeStart = (safePage - 1) * safeLimit;
  const rangeEnd = rangeStart + safeLimit - 1;

  if (!organizationId && !employeeId) {
    return {
      data: [],
      total: 0,
      page: safePage,
      limit: safeLimit,
    };
  }

  let query = createClassRoomsQuery(
    { organizationId, employeeId },
    CLASS_ROOMS_SELECT,
    { count: "exact" },
  );

  query = applyClassRoomFilters(query, {
    runtimeStatus: statusFilter,
    q,
    from,
    to,
    status,
    type,
    sessionMode,
  });

  if (orderField && orderBy) {
    query = query.order(orderField, { ascending: orderBy === "asc" });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query
    .order("sort_rank_primary")
    .order("sort_rank_secondary")
    .range(rangeStart, rangeEnd);

  const { data, error, count } = await query;
  const fnData = data as unknown as ClassRoomPriorityDto[]

  if (error) {
    throw error;
  }

  return {
    data: fnData,
    total: count ?? 0,
    page: safePage,
    limit: safeLimit,
  };
};

const getClassRoomStudents = async (
  input: GetClassRoomStudentsQueryInput,
  client?: SupabaseClient<Database>,
): Promise<PaginatedResult<ClassRoomStudentDto>> => {
  const {
    classRoomId,
    page = 1,
    limit = 20,
    search,
    branchId,
    departmentId,
  } = input;

  const supabaseClient = client ?? supabase;

  const safePage =
    Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit =
    Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 20;
  const rangeStart = (safePage - 1) * safeLimit;
  const rangeEnd = rangeStart + safeLimit - 1;

  if (!classRoomId) {
    return {
      data: [],
      total: 0,
      page: safePage,
      limit: safeLimit,
    };
  }

  let query = supabaseClient
    .from("class_room_employee")
    .select(CLASS_ROOM_STUDENTS_SELECT,
      { count: "exact" },
    )
    .eq("class_room_id", classRoomId)
    .eq("employee.employee_type", "student");

  if (search?.trim()) {
    const sanitized = sanitizeSearchTerm(search.trim());
    query = query.or(
      [
        `full_name.ilike.%${sanitized}%`,
        `email.ilike.%${sanitized}%`,
        `phone_number.ilike.%${sanitized}%`,
      ].join(","), { foreignTable: "employee.profile" }
    );
  }

  if (branchId && branchId !== "all") {
    query = query.eq("employee.branchEmployments.organization_unit_id", branchId);
  }

  if (departmentId && departmentId !== "all") {
    query = query.eq("employee.departmentEmployments.organization_unit_id", departmentId);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error, count } = await query.range(rangeStart, rangeEnd);

  if (error) {
    throw error;
  }

  // Remove auxiliary relations used for filtering so the payload matches the expected DTO shape.
  const rawData = (data ?? []) as Record<string, any>[];
  const parsedData = rawData.map((item) => {
    const {
      employee,
      ...restItem
    } = item as Record<string, any>;

    if (!employee) {
      return {
        ...restItem,
      };
    }

    const { employments, ...restEmployee } = employee;

    return {
      ...restItem,
      employee: {
        ...restEmployee,
        employments: employments ?? [],
      },
    };
  }) as ClassRoomStudentDto[];

  return {
    data: parsedData,
    total: count ?? 0,
    page: safePage,
    limit: safeLimit,
  };
};

const getClassRoomStatusCounts = async (
  input: GetClassRoomStatusCountsInput,
): Promise<ClassRoomStatusCountDto[]> => {

  const trimmedEmployeeId = input.employeeId?.trim();

  if (!trimmedEmployeeId) {
    return [];
  }

  const normalizeString = (value?: string | null) => {
    if (typeof value !== "string") {
      return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };

  const searchValue = normalizeString(input.q);
  const sanitizedSearch = searchValue ? sanitizeSearchTerm(searchValue) : undefined;

  const fromValue = normalizeString(input.from);
  const toValue = normalizeString(input.to);

  const statusFilter =
    input.status && input.status !== ClassRoomStatus.All ? input.status : undefined;

  const typeFilter =
    input.type && input.type !== ClassRoomType.All ? input.type : undefined;

  const sessionModeFilter =
    input.sessionMode && input.sessionMode !== ClassSessionMode.All
      ? input.sessionMode
      : undefined;

  const { data, error } = await supabase.rpc("count_class_room_runtime_status_by_employee", {
    p_employee_id: trimmedEmployeeId,
    p_search: sanitizedSearch,
    p_from: fromValue,
    p_to: toValue,
    p_status: statusFilter,
    p_type: typeFilter,
    p_session_mode: sessionModeFilter,
  });

  if (error) {
    throw error;
  }

  type RawStatusCountRow = {
    runtime_status: string | null;
    total: number | string | null;
  };

  const rawRows = (data ?? []) as RawStatusCountRow[];

  const parsedCounts: ClassRoomStatusCountDto[] = rawRows.map((row) => ({
    runtime_status: row.runtime_status,
    total: Number(row.total ?? 0),
  }));

  return parsedCounts;
};

const deleteClassRoomById = async (classRoomId: string) => {
  const { error } = await supabase.from("class_rooms")
    .update({ status: "deleted" })
    .eq("id", classRoomId);

  if (error) {
    throw new Error(`Failed to delete classRoom: ${error.message}`);
  }
}

const getClassRoomSessionDetail = async (
  input: { sessionId: string },
): Promise<ClassRoomSessionDetailDto | null> => {
  const { sessionId } = input;
  if (!sessionId) {
    throw new Error("Session ID is required to fetch class session");
  }

  const query = supabase
    .from("class_sessions")
    .select(CLASS_SESSION_WITH_CLASS_ROOM_SELECT)
    .eq("id", sessionId)
    .limit(1);

  const { data, error } = await query.maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return (data ?? null) as ClassRoomSessionDetailDto | null;
};

type GetClassRoomsByEmployeeIdInput = Omit<GetClassRoomsQueryInput, "organizationId" | "employeeId"> & {
  employeeId: string;
};

const getClassRoomsByEmployeeId = async (
  input: GetClassRoomsByEmployeeIdInput,
): Promise<PaginatedResult<ClassRoomPriorityDto>> => {
  const {
    employeeId,
    page = PAGE,
    limit = LIMIT,
    runtimeStatus,
    status,
    q,
    from,
    to,
    type,
    sessionMode,
    orderField,
    orderBy,
  } = input;

  const trimmedId = employeeId?.trim();
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : PAGE;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : LIMIT;
  const rangeStart = (safePage - 1) * safeLimit;
  const rangeEnd = rangeStart + safeLimit - 1;

  if (!trimmedId) {
    return {
      data: [],
      total: 0,
      page: safePage,
      limit: safeLimit,
    };
  }

  let query = supabase
    .from("class_rooms_priority")
    .select(
      `
        ${CLASS_ROOMS_SELECT},
        assigneePivot:class_room_employee!inner (
          employee_id
        )
      `,
      { count: "exact" },
    )
    .eq("assigneePivot.employee_id", trimmedId)
    .not("status", "in", "(deleted)");

  query = applyClassRoomFilters(query, {
    runtimeStatus,
    status,
    q,
    from,
    to,
    type,
    sessionMode,
  });

  if (orderField && orderBy) {
    query = query.order(orderField, { ascending: orderBy === "asc" });
  } else {
    query = query
      .order("sort_rank_primary", { ascending: true })
      .order("sort_rank_secondary", { ascending: true })
      .order("created_at", { ascending: false });
  }

  const { data, error, count } = await query.range(rangeStart, rangeEnd);

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as (ClassRoomPriorityDto & {
    assigneePivot?: { employee_id: string }[] | null;
  })[];

  const parsedData = rows.map(({ assigneePivot, ...classRoom }) => classRoom as ClassRoomPriorityDto);

  return {
    data: parsedData,
    total: count ?? 0,
    page: safePage,
    limit: safeLimit,
  };
};

export {
  getClassFieldList,
  getClassHasTagList,
  getClassRooms,
  getClassRoomStudents,
  getClassRoomStatusCounts,
  createClassRoom,
  createClassSession,
  createPivotClassSessionAndTeacher,
  createPivotClassRoomAndHashTag,
  createPivotClassRoomAndField,
  createAgendasWithSession,
  createPivotClassRoomAndEmployee,
  deletePivotClassRoomAndEmployee,
  deleteClassRoomById,
  getClassRoomSessionDetail,
  getClassRoomsByEmployeeId,
}
export type {
  CreateClassRoomPayload,
  CreateClassRoomSessionsPayload,
  CreatePivotClassSessionAndTeacherPayload,
  CreatePivotClassRoomAndFieldPayload,
  CreatePivotClassRoomAndHashTagPayload,
  CreateAgendasWithSessionPayload,
  CreatePivotClassRoomAndEmployeePayload,
  DeletePivotClassRoomAndEmployeePayload,
  GetClassRoomsByEmployeeIdInput,
};
