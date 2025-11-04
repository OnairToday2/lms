import { ClassRoom } from "@/model/class-room.model";
import { ClassSessionAgenda } from "@/model/class-session-agenda.model";

export type CreateClassRoomPayload = Pick<
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
  | "documents"
>;
export type UpdateClassRoomPayload = Pick<
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
  | "id"
  | "documents"
>;
export type UpSertClassRoomPayload =
  | {
      action: "create";
      payload: CreateClassRoomPayload;
    }
  | {
      action: "update";
      payload: UpdateClassRoomPayload;
    };

export type CreatePivotClassRoomAndHashTagPayload = {
  class_room_id: string;
  hash_tag_id: string;
};
export type CreatePivotClassRoomAndFieldPayload = {
  class_room_id: string;
  class_field_id: string;
};

export type CreatePivotClassRoomAndEmployeePayload = {
  class_room_id: string;
  employee_id: string;
};


export enum ClassRoomRuntimeStatus {
  All = "all",
  Ongoing = "ongoing",
  Today = "today",
  Upcoming = "upcoming",
  Past = "past",
  Draft = "draft",
}

export enum ClassRoomType {
  All = "all",
  Single = "single",
  Multiple = "multiple"
}

export enum ClassSessionMode {
  All = "all",
  Online = "online",
  Offline = "offline",
}

export enum ClassRoomStatus {
  All = "all",
  Daft = "draft",
  Publish = "publish",
  Active = "active",
  Pending = "pending",
  Deactive = "deactive",
  Deleted = "deleted",
};

export interface ClassRoomFilters {
  type: ClassRoomType;
  sessionMode: ClassSessionMode;
  search: string;
  startDate?: string | null;
  endDate?: string | null;
  runtimeStatus: ClassRoomRuntimeStatus;
  status: ClassRoomStatus;
}