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
>;
export type UpSertClassRoomPayload = CreateClassRoomPayload | UpdateClassRoomPayload;

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
