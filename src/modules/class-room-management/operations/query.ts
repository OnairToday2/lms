import {
  ClassRoom,
  ClassRoomRuntimeStatus,
} from "@/app/(organization)/class-room/list/types/types";
import { useTQuery } from "@/lib/queryClient";
import {
  classRoomRepository,
} from "@/repository";

export interface GetClassRoomsQueryInput {
  q?: string;
  from?: string | null;
  to?: string | null;
  status?: ClassRoomRuntimeStatus;
  page?: number;
  limit?: number;
}

export interface GetClassRoomsQueryResult {
  items: ClassRoom[];
  total: number;
  page: number;
  limit: number;
}

export const useGetClassRoomsQuery = (
  input: GetClassRoomsQueryInput = {},
) => {
  return useTQuery<GetClassRoomsQueryResult>({
    queryKey: ["class-rooms", input],
    queryFn: () => classRoomRepository.getClassRooms(input),
  });
};


export const useCountStatusClassRoomsQuery = () => {
  return useTQuery({
    queryKey: ["class_room_status_counts"],
    queryFn: () => classRoomRepository.getCountStatusClassRooms(),
  });
};
