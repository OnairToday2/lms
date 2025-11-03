import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import type {
  ClassRoomSession,
} from "@/app/(organization)/class-room/list/types/types";
import { ClassRoomRuntimeStatus } from "@/app/(organization)/class-room/list/types/types";

dayjs.extend(isBetween);

const parseDate = (value?: string | null): Dayjs | null => {
  if (!value) {
    return null;
  }
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

export const resolveSessionStatus = (
  session: ClassRoomSession,
  now: Dayjs = dayjs(),
): ClassRoomRuntimeStatus => {
  const startDate = parseDate(session.start_at);
  const endDate = parseDate(session.end_at);

  if (!startDate) {
    return ClassRoomRuntimeStatus.Past;
  }

  if (endDate && now.isAfter(endDate)) {
    return ClassRoomRuntimeStatus.Past;
  }

  if (now.isBetween(startDate, endDate ?? startDate, null, "[)")) {
    return ClassRoomRuntimeStatus.Ongoing;
  }

  if (now.isBefore(startDate)) {
    return startDate.isSame(now, "day")
      ? ClassRoomRuntimeStatus.Today
      : ClassRoomRuntimeStatus.Upcoming;
  }

  return ClassRoomRuntimeStatus.Past;
};