import { ClassSession } from "@/model/class-session.model";

export type BulkCreateClassRoomSessionsPayload = {
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
    | "location"
  >[];
};

export type CreateClassRoomSessionPayload = Pick<
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
  | "location"
  | "class_room_id"
>;

export type UpdateClassRoomSessionPayload = Pick<
  ClassSession,
  | "id"
  | "title"
  | "start_at"
  | "end_at"
  | "description"
  | "limit_person"
  | "is_online"
  | "resource_ids"
  | "channel_info"
  | "channel_provider"
  | "location"
>;
export type UpSertClassRoomSessionPayload =
  | {
      action: "create";
      payload: CreateClassRoomSessionPayload;
    }
  | {
      action: "update";
      payload: UpdateClassRoomSessionPayload;
    };

export type CreatePivotClassRoomSessionAndTeacherPayload = {
  class_session_id: string;
  teacher_id: string;
};
