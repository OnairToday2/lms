import { Tables } from "@/types/supabase.types";

type EmployeeWithProfileDto = Tables<"employees"> & {
  profile?: Tables<"profiles"> | null;
};

type ClassRoomAssigneeDto = Tables<"class_room_employee"> & {
  employee?: Pick<EmployeeWithProfileDto, "id" | "employee_type"> | null;
};

type ClassSessionTeacherAssignmentDto = Tables<"class_session_teacher"> & {
  teacher?: EmployeeWithProfileDto | null;
};

type ClassRoomSessionDto = Tables<"class_sessions"> & {
  runtimeStatus?: string;
  teacherAssignments?: ClassSessionTeacherAssignmentDto[];
};

export type ClassRoomPriorityDto = Tables<"class_rooms_priority"> & {
  class_sessions: ClassRoomSessionDto[];
  assignees?: ClassRoomAssigneeDto[];
  creator?: EmployeeWithProfileDto | null;
  studentCount?: [{ count: number }];
};

type EmploymentWithOrganizationUnitDto = Tables<"employments"> & {
  organizationUnit?: Pick<
    Tables<"organization_units">,
    "id" | "name" | "type"
  > | null;
};

type ClassRoomStudentEmployeeDto = Tables<"employees"> & {
  profile?: Pick<
    Tables<"profiles">,
    "id" | "full_name" | "email" | "phone_number" | "avatar"
  > | null;
  employments?: EmploymentWithOrganizationUnitDto[];
};

export type ClassRoomStudentDto = Tables<"class_room_employee"> & {
  employee?: ClassRoomStudentEmployeeDto | null;
  class_room_attendance?: Tables<"class_room_attendance">[] | null;
  class_rooms_priority?: { runtime_status: string | null } | null;
};

type ClassRoomSummaryDto = Pick<
  Tables<"class_rooms">,
  | "id"
  | "title"
  | "description"
  | "slug"
  | "thumbnail_url"
  | "start_at"
  | "end_at"
  | "room_type"
  | "status"
  | "organization_id"
  | "employee_id"
> & {
  assignees?: ClassRoomAssigneeDto[] | null;
};

export type ClassRoomSessionDetailDto = Tables<"class_sessions"> & {
  class_room?: ClassRoomSummaryDto | null;
  teacherAssignments?: ClassSessionTeacherAssignmentDto[];
};

export type ClassRoomStatusCountDto = {
  runtime_status: string | null;
  total: number;
};
