import {
  ClassRoomPriority,
  ClassRoomRuntimeStatus,
  ClassRoomStatus,
} from "@/app/(organization)/class-room/list/types/types";
import { useTQuery } from "@/lib/queryClient";
import {
  classRoomRepository,
} from "@/repository";

export interface GetClassRoomsQueryInput {
  q?: string;
  from?: string | null;
  to?: string | null;
  runtimeStatus?: ClassRoomRuntimeStatus;
  status?: ClassRoomStatus;
  page?: number;
  limit?: number;
  org_id?: string;
}

export interface GetClassRoomsQueryResult {
  items: ClassRoomPriority[];
  total: number;
  page: number;
  limit: number;
}

export interface GetAssignedClassRoomsQueryInput
  extends Omit<GetClassRoomsQueryInput, "ownerId"> {
  userId: string;
}

export interface GetClassRoomStatusCountsInput {
  ownerId?: string;
  userId?: string;
  q?: string;
  from?: string | null;
  to?: string | null;
}

export const useGetClassRoomsQuery = (
  input: GetClassRoomsQueryInput = {},
) => {
  return useTQuery<GetClassRoomsQueryResult>({
    queryKey: ["class-rooms", input],
    queryFn: () => classRoomRepository.getClassRooms(input),
    enabled: Boolean(input.org_id),
  });
};

export const useCountStatusClassRoomsQuery = (
  input: GetClassRoomStatusCountsInput,
) => {
  return useTQuery({
    queryKey: ["class_room_status_counts", input],
    queryFn: () => classRoomRepository.getClassRoomStatusCounts(input),
    enabled: Boolean(input.ownerId ?? input.userId),
  });
};
