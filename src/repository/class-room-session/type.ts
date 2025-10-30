import { ClassSession } from "@/model/class-session.model";
import { ClassSessionAgenda } from "@/model/class-session-agenda.model";

export type CreateSessionAgendasPayload = Pick<
  ClassSessionAgenda,
  "title" | "description" | "end_at" | "start_at" | "thumbnail_url" | "class_session_id"
>;

export type CreateClassRoomSessionsPayload = {
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

export type CreatePivotClassRoomSessionAndTeacherPayload = {
  class_session_id: string;
  teacher_id: string;
};
