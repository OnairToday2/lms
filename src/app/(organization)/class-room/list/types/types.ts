import { Tables } from "@/types/supabase.types";

export enum ClassRoomRuntimeStatus {
  All = "all",
  Ongoing = "ongoing",
  Today = "today",
  Upcoming = "upcoming",
  Past = "past",
  Draft = "draft",
}

export type ClassRoomSession = Tables<"class_sessions">;

export type ClassRoomSessionWithRuntime = ClassRoomSession & {
  runtimeStatus?: ClassRoomRuntimeStatus;
};

export interface ClassRoom extends Tables<"class_rooms_priority_v2"> {
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
