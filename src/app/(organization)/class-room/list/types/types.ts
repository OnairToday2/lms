import { ClassRoomPriority as ClassRoomPriorityBase } from "@/model/class-room-priority.model";
import { ClassRoom } from "@/model/class-room.model";
import { ClassSession } from "@/model/class-session.model";
import { Tables } from "@/types/supabase.types";

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

export interface EmployeeWithProfile extends Tables<"employees"> {
  profile?: Tables<"profiles"> | null;
}

export interface ClassRoomAssignee extends Tables<"class_room_employee"> {
  employee?: Pick<EmployeeWithProfile, "id" | "employee_type"> | null;
}

export interface ClassSessionTeacherAssignment
  extends Tables<"class_session_teacher"> {
  teacher?: EmployeeWithProfile | null;
}

export type ClassRoomSessionWithRuntime = ClassSession & {
  runtimeStatus?: ClassRoomRuntimeStatus;
  teacherAssignments?: ClassSessionTeacherAssignment[];
};

interface ClassRoomRelations {
  class_sessions: ClassRoomSessionWithRuntime[];
  assignees?: ClassRoomAssignee[];
  creator?: EmployeeWithProfile | null;
  studentCount?: number;
}

export interface ClassRoomPriority extends ClassRoomPriorityBase, ClassRoomRelations { }

export interface ClassRoomWithRelations extends ClassRoom, ClassRoomRelations { }

export type AttendanceStatus = "attended" | "absent" | "pending";

export interface ClassRoomParticipant {
  id: string;
  userCode: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  department?: string;
  branch?: string;
  assignedAt: string;
  attendanceStatus?: AttendanceStatus;
  attendAt?: string | null;
  leaveAt?: string | null;
  sessionIds?: string[];
}

export interface ClassRoomFilters {
  type: ClassRoomType;
  sessionMode: ClassSessionMode;
  search: string;
  startDate?: string | null;
  endDate?: string | null;
  runtimeStatus: ClassRoomRuntimeStatus;
  status: ClassRoomStatus;
}
