import { ClassRoomPriority as ClassRoomPriorityBase } from "@/model/class-room-priority.model";
import { ClassSession } from "@/model/class-session.model";

export enum ClassRoomRuntimeStatus {
  All = "all",
  Ongoing = "ongoing",
  Today = "today",
  Upcoming = "upcoming",
  Past = "past",
  Draft = "draft",
}
export type ClassRoomSessionWithRuntime = ClassSession & {
  runtimeStatus?: ClassRoomRuntimeStatus;
};
export interface ClassRoomPriority extends ClassRoomPriorityBase {
  class_sessions: ClassRoomSessionWithRuntime[];
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
  status: ClassRoomRuntimeStatus;
  startDate?: string | null;
  endDate?: string | null;
}
