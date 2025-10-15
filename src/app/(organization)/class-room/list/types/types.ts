import { Tables } from "@/types/supabase.types";

export enum ClassRoomRuntimeStatus {
  All = "all",
  Ongoing = "ongoing",
  Today = "today",
  Upcoming = "upcoming",
  Past = "past",
  Draft = "draft",
}

export const COURSE_RUNTIME_STATUS_LABEL: Record<ClassRoomRuntimeStatus, string> = {
  [ClassRoomRuntimeStatus.All]: "Tất cả",
  [ClassRoomRuntimeStatus.Ongoing]: "Đang diễn ra",
  [ClassRoomRuntimeStatus.Today]: "Diễn ra hôm nay",
  [ClassRoomRuntimeStatus.Upcoming]: "Sắp diễn ra",
  [ClassRoomRuntimeStatus.Past]: "Đã diễn ra",
  [ClassRoomRuntimeStatus.Draft]: "Bản nháp",
};

export type ClassRoomSession = Tables<"class_sessions">;

export interface ClassRoom extends Tables<"class_rooms"> {
  class_sessions: ClassRoomSession[];
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
