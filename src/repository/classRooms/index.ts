import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { supabase } from "@/services";
import {
  GetAssignedClassRoomsQueryInput,
  GetClassRoomStatusCountsInput,
  GetClassRoomsQueryInput,
  GetClassRoomsQueryResult,
} from "@/modules/class-room-management/operations/query";
import {
  ClassRoomRuntimeStatus,
} from "@/app/(organization)/class-room/list/types/types";

const PAGE = 1;
const LIMIT = 9;

type ClassRoomFilters = {
  status?: ClassRoomRuntimeStatus;
  from?: string | null;
  to?: string | null;
  q?: string;
};

type ClassRoomScope =
  | { ownerId: string; classRoomIds?: never }
  | { ownerId?: never; classRoomIds: string[] };

const sanitizeSearchTerm = (value: string) =>
  value.replace(/%/g, "\\%").replace(/_/g, "\\_").replace(/,/g, " ");

const applyClassRoomFilters = <
  T extends PostgrestFilterBuilder<any, any, any, any>,
>(
  query: T,
  filters: ClassRoomFilters = {},
): T => {
  const { status, from, to, q } = filters;
  let builder = query;

  if (status && status !== ClassRoomRuntimeStatus.All) {
    builder = builder.eq("runtime_status", status);
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
  scope: ClassRoomScope,
  select: string,
  options?: { count?: "exact" | "planned" | "estimated"; head?: boolean },
) => {
  let query = supabase
    .from("class_rooms_priority_v2")
    .select(select, options);

  if ("ownerId" in scope) {
    query = query.eq("user_id", scope.ownerId!);
  } else {
    query = query.in("id", scope.classRoomIds);
  }

  return query;
};

const fetchAssignedClassRoomIds = async (userId: string): Promise<string[]> => {
  const { data: employeeRows, error: employeeError } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", userId);

  if (employeeError) {
    throw employeeError;
  }

  const employeeIds =
    employeeRows?.map((employee) => employee.id).filter((id): id is string => Boolean(id)) ?? [];

  if (employeeIds.length === 0) {
    return [];
  }

  const { data: assignmentRows, error: assignmentError } = await supabase
    .from("class_room_employee")
    .select("class_room_id")
    .in("employee_id", employeeIds);

  if (assignmentError) {
    throw assignmentError;
  }

  return Array.from(
    new Set(
      assignmentRows
        ?.map((assignment) => assignment.class_room_id)
        .filter((classRoomId): classRoomId is string => Boolean(classRoomId)) ?? [],
    ),
  );
};

const getClassRooms = async (
  input: GetClassRoomsQueryInput = {},
): Promise<GetClassRoomsQueryResult> => {
  const {
    page = PAGE,
    limit = LIMIT,
    status: statusFilter,
    q,
    from,
    to,
    ownerId,
  } = input;

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;
  const rangeStart = (safePage - 1) * safeLimit;
  const rangeEnd = rangeStart + safeLimit - 1;

  if (!ownerId) {
    return {
      items: [],
      total: 0,
      page: safePage,
      limit: safeLimit,
    };
  }

  let query = createClassRoomsQuery(
    { ownerId },
    "*, class_sessions(*)",
    { count: "exact" },
  );

  query = applyClassRoomFilters(query, { status: statusFilter, q, from, to });

  query = query
    .order("sort_rank_primary")
    .order("sort_rank_secondary")
    .range(rangeStart, rangeEnd);

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  return {
    items: data ?? [],
    total: count ?? 0,
    page: safePage,
    limit: safeLimit,
  };
};

const getAssignedClassRooms = async (
  input: GetAssignedClassRoomsQueryInput,
): Promise<GetClassRoomsQueryResult> => {
  const {
    page = PAGE,
    limit = LIMIT,
    status: statusFilter,
    q,
    from,
    to,
    userId,
  } = input;

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;
  const rangeStart = (safePage - 1) * safeLimit;
  const rangeEnd = rangeStart + safeLimit - 1;

  if (!userId) {
    return {
      items: [],
      total: 0,
      page: safePage,
      limit: safeLimit,
    };
  }

  const classRoomIds = await fetchAssignedClassRoomIds(userId);

  if (classRoomIds.length === 0) {
    return {
      items: [],
      total: 0,
      page: safePage,
      limit: safeLimit,
    };
  }

  let query = createClassRoomsQuery(
    { classRoomIds },
    "*, class_sessions(*)",
    { count: "exact" },
  );

  query = applyClassRoomFilters(query, { status: statusFilter, q, from, to });

  query = query
    .order("sort_rank_primary")
    .order("sort_rank_secondary")
    .range(rangeStart, rangeEnd);

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  return {
    items: data ?? [],
    total: count ?? 0,
    page: safePage,
    limit: safeLimit,
  };
};

const getClassRoomStatusCounts = async (input: GetClassRoomStatusCountsInput) => {
  const { data, error } = await supabase.rpc("class_room_status_counts_filtered", {
    in_owner_id: input.ownerId! ?? null,
    in_user_id: input.userId! ?? null,
    in_from: input.from! ?? null,
    in_to: input.to! ?? null,
    in_search: input.q! ?? null,
  });

  if (error) {
    throw error;
  }
  return data;
};

const getClassFieldList = async () => {
  return await supabase.from("class_fields").select("*");
};

const getClassHasTagList = async () => {
  return await supabase.from("hash_tags").select("*");
};

export {
  getClassRooms,
  getAssignedClassRooms,
  getClassRoomStatusCounts,
  getClassFieldList,
  getClassHasTagList,
};
