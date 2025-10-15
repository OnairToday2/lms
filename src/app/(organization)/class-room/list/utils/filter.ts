import dayjs from "dayjs";
import { ClassRoomFilters, ClassRoomRuntimeStatus, ClassRoomWithStatus } from "../types/types";

const removeTones = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

export const normalizeText = (value: string) =>
  removeTones(value).toLowerCase().trim();

const matchSearch = (course: ClassRoomWithStatus, search: string) => {
  if (!search) {
    return true;
  }

  const normalizedSearch = normalizeText(search);

  const fieldsToSearch = [
    course.title,
    course.description ?? "",
    ...(course.hashTags ?? []),
  ];

  return fieldsToSearch.some((field) =>
    normalizeText(field ?? "").includes(normalizedSearch),
  );
};

const matchDateRange = (
  course: ClassRoomWithStatus,
  startDate?: string | null,
  endDate?: string | null,
) => {
  if (!startDate && !endDate) {
    return true;
  }

  const startBoundary = startDate ? dayjs(startDate).startOf("day") : null;
  const endBoundary = endDate ? dayjs(endDate).endOf("day") : null;

  return course.sessions.some((session) => {
    const sessionStart = dayjs(session.startAt);
    const sessionEnd = session.endAt ? dayjs(session.endAt) : sessionStart;

    if (!sessionStart.isValid()) {
      return false;
    }

    if (startBoundary && sessionEnd.isBefore(startBoundary)) {
      return false;
    }

    if (endBoundary && sessionStart.isAfter(endBoundary)) {
      return false;
    }

    return true;
  });
};

export const filterClassRoomsBySearchAndDate = (
  courses: ClassRoomWithStatus[],
  filters: Pick<ClassRoomFilters, "search" | "startDate" | "endDate">,
) => {
  const { search, startDate, endDate } = filters;
  return courses.filter(
    (course) =>
      matchSearch(course, search) && matchDateRange(course, startDate, endDate),
  );
};

export const filterCoursesByStatus = (
  courses: ClassRoomWithStatus[],
  status: ClassRoomRuntimeStatus,
) => {
  if (status === ClassRoomRuntimeStatus.All) {
    return courses;
  }
  return courses.filter((course) => course.runtimeStatus === status);
};

export const countCoursesByStatus = (courses: ClassRoomWithStatus[]) => {
  return courses.reduce<Record<ClassRoomRuntimeStatus, number>>(
    (acc, course) => {
      acc[course.runtimeStatus] = (acc[course.runtimeStatus] ?? 0) + 1;
      acc[ClassRoomRuntimeStatus.All] = (acc[ClassRoomRuntimeStatus.All] ?? 0) + 1;
      return acc;
    },
    {
      [ClassRoomRuntimeStatus.All]: 0,
      [ClassRoomRuntimeStatus.Ongoing]: 0,
      [ClassRoomRuntimeStatus.Today]: 0,
      [ClassRoomRuntimeStatus.Upcoming]: 0,
      [ClassRoomRuntimeStatus.Past]: 0,
      [ClassRoomRuntimeStatus.Draft]: 0,
    },
  );
};
