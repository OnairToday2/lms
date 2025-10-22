import { ClassRoomPriority as ClassRoomPriorityBase } from "@/model/class-room-priority.model";
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

export enum ClassRoomStatus {
  All = "all",
  Daft = "draft",
  Publish = "publish",
  Active = "active",
  Pending = "pending",
  Deactive = "deactive",
  Deleted = "deleted",
};

export type ClassRoomSessionWithRuntime = ClassSession & {
  runtimeStatus?: ClassRoomRuntimeStatus;
};

export type UserProfile = Tables<"profiles">;
export interface ClassRoomPriority extends ClassRoomPriorityBase {
  class_sessions: ClassRoomSessionWithRuntime[];
  createdBy?: UserProfile | null;
}

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
  search: string;
  startDate?: string | null;
  endDate?: string | null;
  runtimeStatus: ClassRoomRuntimeStatus;
  status: ClassRoomStatus;
}
