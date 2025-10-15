import { supabase } from "@/services";
import { mockCourses } from "./data/mockCourses";
import { ClassRoom, ClassRoomParticipant, ClassRoomSession } from "./types/types";

type RawSession = {
  id: string;
  title: string | null;
  description: string | null;
  start_at: string | null;
  end_at: string | null;
  is_online: boolean | null;
  channel_provider: string | null;
  channel_info: Record<string, unknown> | null;
};

type RawMetadata = {
  key: string | null;
  value: Record<string, unknown> | null;
};

type RawEnrollment = {
  id: string;
  created_at: string | null;
  employee_id: string | null;
  employee?: {
    profiles?: Array<{
      full_name: string | null;
      email: string | null;
      phone_number: string | null;
    }>;
    employments?: Array<{
      organization_unit?: {
        name: string | null;
        parent?: {
          name: string | null;
        };
      };
    }>;
    code?: string | null;
  };
  attendance_status?: string | null;
  attend_at?: string | null;
  leave_at?: string | null;
};

type RawCourse = {
  id: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  status: string | null;
  room_type: string | null;
  created_at: string | null;
  updated_at: string | null;
  slug: string | null;
  class_sessions?: RawSession[];
  class_room_employee?: RawEnrollment[];
  class_room_metadata?: RawMetadata[];
};

const parseRoomUrl = (session: RawSession) => {
  const info = session.channel_info ?? {};
  if (typeof info === "object" && info !== null) {
    const urlLike =
      (info as Record<string, unknown>).roomUrl ??
      (info as Record<string, unknown>).url ??
      (info as Record<string, unknown>).meetingUrl ??
      (info as Record<string, unknown>).meeting_url;
    if (typeof urlLike === "string") {
      return urlLike;
    }
  }
  return undefined;
};

const transformSession = (session: RawSession): ClassRoomSession | null => {
  if (!session.start_at) {
    return null;
  }
  return {
    id: session.id,
    title: session.title ?? "Buổi học",
    description: session.description,
    startAt: session.start_at,
    endAt: session.end_at ?? session.start_at,
    isOnline: session.is_online ?? undefined,
    channelProvider: session.channel_provider,
    channelInfo: session.channel_info ?? undefined,
    roomUrl: parseRoomUrl(session),
  };
};

const transformEnrollment = (enrollment: RawEnrollment): ClassRoomParticipant => {
  const profile = enrollment.employee?.profiles?.[0];
  const employment = enrollment.employee?.employments?.[0];
  const department = employment?.organization_unit?.name ?? undefined;
  const branch = employment?.organization_unit?.parent?.name ?? undefined;
  return {
    id: enrollment.id,
    userCode:
      enrollment.employee?.code ??
      enrollment.employee_id ??
      `EMP-${enrollment.id.slice(0, 6)}`,
    fullName: profile?.full_name ?? "Chưa cập nhật",
    email: profile?.email ?? undefined,
    phoneNumber: profile?.phone_number ?? undefined,
    department,
    branch,
    assignedAt: enrollment.created_at ?? new Date().toISOString(),
    attendanceStatus: parseAttendanceStatus(enrollment.attendance_status),
    attendAt: enrollment.attend_at ?? undefined,
    leaveAt: enrollment.leave_at ?? undefined,
  };
};

const parseAttendanceStatus = (
  status: string | null | undefined,
): ClassRoomParticipant["attendanceStatus"] => {
  switch (status) {
    case "attended":
    case "present":
      return "attended";
    case "absent":
    case "not_attended":
      return "absent";
    default:
      return "pending";
  }
};

const transformCourseRow = (row: RawCourse): ClassRoom => {
  const sessions = (row.class_sessions ?? [])
    .map(transformSession)
    .filter((session): session is ClassRoomSession => Boolean(session));

  const participants = (row.class_room_employee ?? []).map(transformEnrollment);

  const metadataEntries = (row.class_room_metadata ?? []).reduce<
    Record<string, unknown>
  >((acc, item) => {
    if (item.key && item.value) {
      acc[item.key] = item.value;
    }
    return acc;
  }, {});

  return {
    id: row.id,
    slug: row.slug,
    title: row.title ?? "Lớp học trực tuyến",
    description: row.description,
    thumbnailUrl: row.thumbnail_url,
    status: row.status ?? "draft",
    roomType: (row.room_type as ClassRoom["roomType"]) ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? undefined,
    sessions,
    assignedParticipants: participants,
    attendees: participants.filter(
      (participant) => participant.attendanceStatus === "attended",
    ),
    metadata: Object.keys(metadataEntries).length ? metadataEntries : undefined,
  };
};

const shouldUseMockData = () => {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
  );
};

export const fetchCourses = async (): Promise<ClassRoom[]> => {
  if (shouldUseMockData()) {
    return mockCourses;
  }

  try {
    const { data, error } = await supabase
      .from("class_rooms")
      .select(`
          id,
          title,
          description,
          thumbnail_url,
          status,
          room_type,
          created_at,
          slug,
          class_sessions (
            id,
            title,
            description,
            start_at,
            end_at,
            is_online,
            channel_provider,
            channel_info
          )
          class_room_metadata (
            key,
            value
          )
        `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[fetchCourses] Supabase error:", error);
      return mockCourses;
    }

    if (!data || data.length === 0) {
      return mockCourses;
    }

    return data.map(transformCourseRow);
  } catch (error) {
    console.error("[fetchCourses] Unexpected error:", error);
    return mockCourses;
  }
};


//  id,
//           title,
//           description,
//           thumbnail_url,
//           status,
//           room_type,
//           created_at,
//           updated_at,
//           slug,
//           class_sessions (
//             id,
//             title,
//             description,
//             start_at,
//             end_at,
//             is_online,
//             channel_provider,
//             channel_info
//           ),
//           class_room_employee (
//             id,
//             created_at,
//             employee_id,
//             attendance_status,
//             attend_at,
//             leave_at,
//             employee:employees (
//               code,
//               profiles (
//                 full_name,
//                 email,
//                 phone_number
//               ),
//               employments (
//                 organization_unit:organization_units (
//                   name,
//                   parent:organization_units (
//                     name
//                   )
//                 )
//               )
//             )
//           ),
//           class_room_metadata (
//             key,
//             value
//           )