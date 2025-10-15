import { ClassRoomRuntimeStatus } from "../types/types";

const STATUS_COLOR_MAP: Record<
  ClassRoomRuntimeStatus,
  "primary" | "error" | "secondary" | "default" | "info" | "success"
> = {
  [ClassRoomRuntimeStatus.All]: "default",
  [ClassRoomRuntimeStatus.Ongoing]: "error",
  [ClassRoomRuntimeStatus.Today]: "primary",
  [ClassRoomRuntimeStatus.Upcoming]: "success",
  [ClassRoomRuntimeStatus.Past]: "default",
  [ClassRoomRuntimeStatus.Draft]: "info",
};

export const STATUS_ORDER: ClassRoomRuntimeStatus[] = [
  ClassRoomRuntimeStatus.All,
  ClassRoomRuntimeStatus.Ongoing,
  ClassRoomRuntimeStatus.Today,
  ClassRoomRuntimeStatus.Upcoming,
  ClassRoomRuntimeStatus.Past,
  ClassRoomRuntimeStatus.Draft,
];

export const COURSE_RUNTIME_STATUS_LABEL: Record<ClassRoomRuntimeStatus, string> = {
  [ClassRoomRuntimeStatus.All]: "Tất cả",
  [ClassRoomRuntimeStatus.Ongoing]: "Đang diễn ra",
  [ClassRoomRuntimeStatus.Today]: "Diễn ra hôm nay",
  [ClassRoomRuntimeStatus.Upcoming]: "Sắp diễn ra",
  [ClassRoomRuntimeStatus.Past]: "Đã diễn ra",
  [ClassRoomRuntimeStatus.Draft]: "Bản nháp",
};

export const getClassRoomStatus = (status: ClassRoomRuntimeStatus) =>
  COURSE_RUNTIME_STATUS_LABEL[status] ?? COURSE_RUNTIME_STATUS_LABEL[ClassRoomRuntimeStatus.All];

export const getColorClassRoomStatus = (status: ClassRoomRuntimeStatus) =>
  STATUS_COLOR_MAP[status] ?? STATUS_COLOR_MAP[ClassRoomRuntimeStatus.All];

export const getStatusAndLabelBtnJoin = (status: ClassRoomRuntimeStatus): { label: string, disabled: boolean } => {
  switch (status) {
    case ClassRoomRuntimeStatus.Draft:
      return {
        label: "Đăng tải",
        disabled: false,
      }
    case ClassRoomRuntimeStatus.Upcoming:
    case ClassRoomRuntimeStatus.Today:
    case ClassRoomRuntimeStatus.Ongoing:
      return {
        label: "Vào lớp học",
        disabled: false,
      }
    case ClassRoomRuntimeStatus.Past:
      return {
        label: "Đã diễn ra",
        disabled: true,
      }
    default:
      return {
        label: "Mặc định",
        disabled: false,
      }
  }
} 