import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

type Kind =
  | "draft"
  | "today"
  | "ongoing"
  | "upcoming"
  | "ended"
  | "unknown";

const LABEL_MAP: Record<Kind, string> = {
  draft: "Nháp",
  today: "Diễn ra hôm nay",
  ongoing: "Đang diễn ra",
  upcoming: "Sắp diễn ra",
  ended: "Đã kết thúc",
  unknown: "Không xác định",
};

const COLOR_MAP: Record<Kind, "primary" | "error" | "secondary" | "default" | "info" | "success"> = {
  today: "primary",
  ongoing: "error",
  upcoming: "secondary",
  ended: "default",
  draft: "default",
  unknown: "default",
};

const BUTTON_LABEL_MAP: Record<Kind, string> = {
  draft: "Đăng tải",
  today: "Vào lớp học",
  ongoing: "Vào lớp học",
  upcoming: "Vào lớp học",
  ended: "Đã diễn ra",
  unknown: "Không xác định",
};


function computeClassRoomStatusKind(
  startDate: string,
  endDate: string,
  status: any
): Kind {
  if (String(status ?? "").toLowerCase() === "draft") return "draft";

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const now = dayjs();

  if (!start.isValid() || !end.isValid()) return "unknown";

  const isSameDay = start.isSame(end, "day");

  // Nếu cùng ngày nhưng đã qua rồi → Đã kết thúc
  if (isSameDay) {
    if (now.isSame(start, "day")) {
      if (now.isBefore(start)) return "upcoming";
      if (now.isAfter(end)) return "ended";
      return "today"; // trong khoảng start-end của hôm nay
    }
    if (now.isBefore(start)) return "upcoming";
    if (now.isAfter(end)) return "ended";
  }

  // Nhiều ngày
  if (now.isAfter(start) && now.isBefore(end)) return "ongoing";
  if (now.isBefore(start)) return "upcoming";
  if (now.isAfter(end)) return "ended";

  return "unknown";
}

export function getClassRoomStatus(
  startDate: string,
  endDate: string,
  status?: any
) {
  return LABEL_MAP[computeClassRoomStatusKind(startDate, endDate, status)];
}

export function getColorClassRoomStatus(
  startDate: string,
  endDate: string,
  status?: any
) {
  return COLOR_MAP[computeClassRoomStatusKind(startDate, endDate, status)];
}

export function getLabelBtn(
  startDate: string,
  endDate: string,
  status?: any
) {
  return BUTTON_LABEL_MAP[computeClassRoomStatusKind(startDate, endDate, status)];
}