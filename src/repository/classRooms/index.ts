import { supabase } from "@/services";
import {
  GetClassRoomsQueryInput,
  GetClassRoomsQueryResult,
} from "@/modules/class-room-management/operations/query";
import {
  ClassRoomRuntimeStatus,
} from "@/app/(organization)/class-room/list/types/types";

const PAGE = 1;
const LIMIT = 9;

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
  } = input;

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;
  const rangeStart = (safePage - 1) * safeLimit;
  const rangeEnd = rangeStart + safeLimit - 1;

  let query = supabase
    .from("class_rooms_priority_v2")
    .select("*, class_sessions(*)", { count: "exact" })
    .order("sort_rank_primary")
    .order("sort_rank_secondary")
    .range(rangeStart, rangeEnd);

  if (statusFilter && statusFilter !== ClassRoomRuntimeStatus.All) {
    query = query.eq("runtime_status", statusFilter);
  }

  if (from) {
    query = query.gte("computed_end_at", from);
  }

  if (to) {
    query = query.lte("computed_start_at", to);
  }

  if (q) {
    const trimmed = q.trim();
    if (trimmed) {
      const escaped = trimmed
        .replace(/%/g, "\\%")
        .replace(/_/g, "\\_")
        .replace(/,/g, " ");
      query = query.or(
        [
          `title.ilike.%${escaped}%`,
          `description.ilike.%${escaped}%`,
        ].join(","),
      );
    }
  }

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  return {
    items: data,
    total: count ?? 0,
    page: safePage,
    limit: safeLimit,
  };
};

const getCountStatusClassRooms = async () => {
  const { data, error } = await supabase.rpc("class_room_runtime_status_counts");
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
  getCountStatusClassRooms,
  getClassFieldList,
  getClassHasTagList
};
