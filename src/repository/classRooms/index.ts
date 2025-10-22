import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { supabase } from "@/services";
import {
  GetClassRoomStatusCountsInput,
  GetClassRoomsQueryInput,
  GetClassRoomsQueryResult,
} from "@/modules/class-room-management/operations/query";
import {
  ClassRoomPriority,
  ClassRoomRuntimeStatus,
  ClassRoomStatus,
} from "@/app/(organization)/class-room/list/types/types";

const PAGE = 1;
const LIMIT = 9;

type ClassRoomFilters = {
  runtimeStatus?: ClassRoomRuntimeStatus;
  status?: ClassRoomStatus;
  from?: string | null;
  to?: string | null;
  q?: string;
};


const sanitizeSearchTerm = (value: string) =>
  value.replace(/%/g, "\\%").replace(/_/g, "\\_").replace(/,/g, " ");

const applyClassRoomFilters = <
  T extends PostgrestFilterBuilder<any, any, any, any>,
>(
  query: T,
  filters: ClassRoomFilters = {},
): T => {
  const { status, runtimeStatus, from, to, q } = filters;
  let builder = query;

  if (status && status !== ClassRoomStatus.All) {
    builder = builder.eq("status", status);
  }

  if (runtimeStatus && runtimeStatus !== ClassRoomRuntimeStatus.All) {
    builder = builder.eq("runtime_status", runtimeStatus);
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
  org_id: string,
  select: string,
  options?: { count?: "exact" | "planned" | "estimated"; head?: boolean },
) => {
  let query = supabase
    .from("class_rooms_priority")
    .select(select, options);

  if (org_id) {
    query = query.eq("organization_id", org_id!);
  }

  return query;
};

const getClassRooms = async (
  input: GetClassRoomsQueryInput = {},
): Promise<GetClassRoomsQueryResult> => {
  const {
    page = PAGE,
    limit = LIMIT,
    runtimeStatus: statusFilter,
    status,
    q,
    from,
    to,
    org_id,
  } = input;

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;
  const rangeStart = (safePage - 1) * safeLimit;
  const rangeEnd = rangeStart + safeLimit - 1;

  if (!org_id) {
    return {
      items: [],
      total: 0,
      page: safePage,
      limit: safeLimit,
    };
  }

  let query = createClassRoomsQuery(
    org_id,
    "*, class_sessions(*)",
    { count: "exact" },
  );

  query = applyClassRoomFilters(query, { runtimeStatus: statusFilter, q, from, to, status });

  query = query
    .order("sort_rank_primary")
    .order("sort_rank_secondary")
    .range(rangeStart, rangeEnd);

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  return {
    items: data as unknown as ClassRoomPriority[] ?? [],
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
  getClassRoomStatusCounts,
  getClassFieldList,
  getClassHasTagList,
};
