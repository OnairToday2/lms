import { ClassRoom } from "@/model/class-room.model";
import { ClassSession } from "@/model/class-session.model";
import { ClassSessionAgenda } from "@/model/class-session-agenda.model";
import { ClassRoomMetaKey } from "@/constants/class-room-meta.constant";
import { ClassQRCode, AttendanceStatus } from "@/model/qr-attendance.model";

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

export type CreatePivotClassRoomAndHashTagPayload = {
  class_room_id: string;
  hash_tag_id: string;
};
export type CreatePivotClassRoomAndFieldPayload = {
  class_room_id: string;
  class_field_id: string;
};
export type CreateAgendasWithSessionPayload = Pick<
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

export type CreatePivotClassSessionAndTeacherPayload = {
  class_session_id: string;
  teacher_id: string;
};

export type CreatePivotClassRoomAndEmployeePayload = {
  class_room_id: string;
  employee_id: string;
};

export type GetClassRoomMetaQueryParams = {
  class_room_id: string;
  key?: ClassRoomMetaKey;
};

export type CreateClassRoomMetaPayload = {
  class_room_id: string;
  key: ClassRoomMetaKey;
  value: any;
};


export type CreateQRCodePayload = Pick<
  ClassQRCode,
  | "title"
  | "description"
  | "valid_from"
  | "valid_until"
  | "checkin_start_time"
  | "checkin_end_time"
  | "created_by"
> & {
  class_room_id?: string;
  class_session_id?: string;
};

export interface QRCodeValidationResult {
  is_valid: boolean;
  qr_code_id?: string;
  message: string;
}

export interface AttendanceCheckInPayload {
  qr_code: string;
  employee_id: string;
  device_info?: Record<string, any>;
}

export interface AttendanceCheckInResult {
  success: boolean;
  message: string;
  attendance?: {
    id: string;
    qr_code_id: string;
    employee_id: string;
    class_room_id: string | null;
    class_session_id: string | null;
    attendance_status: AttendanceStatus | null;
    attended_at: string | null;
    created_at: string | null;
    device_info?: Record<string, any> | null;
    rejection_reason?: string | null;
  };
  rejection_reason?: string;
}

export interface UpdateQRCodePayload {
  title?: string;
  description?: string;
  valid_from?: string;
  valid_until?: string;
  checkin_start_time?: string;
  checkin_end_time?: string;
}
