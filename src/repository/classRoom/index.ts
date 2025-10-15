import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  ClassRoom,
  ClassRoomParticipant,
  ClassRoomRuntimeStatus,
  ClassRoomSession,
} from "@/app/(organization)/class-room/list/types/types";
import { GetClassRoomsQueryInput } from "@/modules/classRoom/query";
import { supabase } from "@/services";
import { mockCourses } from "@/app/(organization)/class-room/list/data/mockCourses";
import { SELECT_CLASS_ROOM } from "./constants";

dayjs.extend(isBetween);

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

type RawEmployment = {
  organization_unit?: {
    name: string | null;
    parent?: {
      name: string | null;
    } | null;
  } | null;
};

type RawProfile = {
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
};

type RawEmployee = {
  code?: string | null;
  profiles?: RawProfile[];
  employments?: RawEmployment[];
};

type RawEnrollment = {
  id: string;
  created_at: string | null;
  employee_id: string | null;
  attendance_status?: string | null;
  attend_at?: string | null;
  leave_at?: string | null;
  employee?: RawEmployee;
};

type RawClassRoom = {
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

const shouldUseMockData = () =>
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

const buildSearchPattern = (value: string) =>
  `%${value.replace(/[%_]/g, (match) => `\\${match}`)}%`;

const removeTones = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

const normalizeText = (value: string) => removeTones(value).toLowerCase().trim();

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
    roomUrl: (() => {
      const info = session.channel_info ?? {};
      if (typeof info === "object" && info !== null) {
        const asRecord = info as Record<string, unknown>;
        const roomUrl =
          asRecord.roomUrl ??
          asRecord.url ??
          asRecord.meetingUrl ??
          asRecord.meeting_url;
        if (typeof roomUrl === "string") {
          return roomUrl;
        }
      }
      return undefined;
    })(),
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

const transformEnrollment = (
  enrollment: RawEnrollment,
): ClassRoomParticipant => {
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

const transformClassRoom = (row: RawClassRoom): ClassRoom => {
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
    thumbnail_url: row.thumbnail_url,
    status: row.status ?? "draft",
    room_type: (row.room_type as ClassRoom["roomType"]) ?? undefined,
    created_at: row.created_at ?? new Date().toISOString(),
    updated_at: row.updated_at,
    sessions,
    assignedParticipants: participants,
    attendees: participants.filter(
      (participant) => participant.attendanceStatus === "attended",
    ),
    metadata: Object.keys(metadataEntries).length ? metadataEntries : undefined,
  };
};

const matchSearch = (classRoom: ClassRoomWithStatus, keyword?: string) => {
  if (!keyword) {
    return true;
  }
  const normalizedKeyword = normalizeText(keyword);
  const fields = [
    classRoom.title,
    classRoom.description ?? "",
    ...(classRoom.hashTags ?? []),
  ];
  return fields.some((field) =>
    normalizeText(field ?? "").includes(normalizedKeyword),
  );
};

const matchDateRange = (
  classRoom: ClassRoomWithStatus,
  from?: string | null,
  to?: string | null,
) => {
  if (!from && !to) {
    return true;
  }
  const fromBoundary = from ? dayjs(from) : null;
  const toBoundary = to ? dayjs(to) : null;

  return classRoom.sessions.some((session) => {
    const sessionStart = dayjs(session.startAt);
    const sessionEnd = session.endAt ? dayjs(session.endAt) : sessionStart;

    if (!sessionStart.isValid()) {
      return false;
    }

    if (fromBoundary && sessionEnd.isBefore(fromBoundary)) {
      return false;
    }

    if (toBoundary && sessionStart.isAfter(toBoundary)) {
      return false;
    }

    return true;
  });
};

const SESSION_STATUS_ORDER: Record<ClassRoomRuntimeStatus, number> = {
  [ClassRoomRuntimeStatus.Ongoing]: 1,
  [ClassRoomRuntimeStatus.Today]: 2,
  [ClassRoomRuntimeStatus.Upcoming]: 3,
  [ClassRoomRuntimeStatus.Past]: 4,
  [ClassRoomRuntimeStatus.Draft]: 5,
  [ClassRoomRuntimeStatus.All]: 0,
};

const sortSessionsByStart = (sessions: ClassRoomSession[]) =>
  [...sessions].sort(
    (a, b) => dayjs(a.startAt).valueOf() - dayjs(b.startAt).valueOf(),
  );

const resolveSessionRuntimeStatus = (
  session: ClassRoomSession,
  now: Dayjs,
): ClassRoomRuntimeStatus => {
  const startAt = dayjs(session.startAt);
  const endAt = session.endAt ? dayjs(session.endAt) : startAt;

  if (startAt.isValid() && endAt.isValid()) {
    if (now.isBetween(startAt, endAt, null, "[)")) {
      return ClassRoomRuntimeStatus.Ongoing;
    }
    if (now.isAfter(endAt)) {
      return ClassRoomRuntimeStatus.Past;
    }
  }

  if (startAt.isValid()) {
    if (startAt.isSame(now, "day")) {
      if (startAt.isAfter(now)) {
        return ClassRoomRuntimeStatus.Today;
      }
      return ClassRoomRuntimeStatus.Ongoing;
    }
    if (startAt.isAfter(now)) {
      return ClassRoomRuntimeStatus.Upcoming;
    }
    if (startAt.isBefore(now)) {
      return ClassRoomRuntimeStatus.Past;
    }
  }

  return ClassRoomRuntimeStatus.Past;
};

export const getClassRooms = async (
  input: GetClassRoomsQueryInput = {},
) => {

  const { q, from, to } = input;

  const { data, error } = await supabase
    .from("class_rooms")
    .select(SELECT_CLASS_ROOM)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export const getCountStatusClassRooms = async () => {
  const { data, error } = await supabase.rpc("class_room_status_counts");

  if (error) {
    throw error;
  }

  return data;
};