import { ClassRoomRuntimeStatus, ClassRoomStatus, ClassRoomType } from "../types/types";

const RUNTIME_STATUS_COLOR_MAP: Record<
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

const STATUS_COLOR_MAP: Record<
  ClassRoomStatus,
  "primary" | "error" | "secondary" | "default" | "info" | "success"
> = {
  [ClassRoomStatus.All]: "default",
  [ClassRoomStatus.Active]: "error",
  [ClassRoomStatus.Daft]: "primary",
  [ClassRoomStatus.Deactive]: "success",
  [ClassRoomStatus.Deleted]: "default",
  [ClassRoomStatus.Pending]: "info",
  [ClassRoomStatus.Publish]: "success",
};


export const STATUS_ORDER: ClassRoomRuntimeStatus[] = [
  ClassRoomRuntimeStatus.All,
  ClassRoomRuntimeStatus.Ongoing,
  ClassRoomRuntimeStatus.Today,
  ClassRoomRuntimeStatus.Upcoming,
  ClassRoomRuntimeStatus.Past,
  ClassRoomRuntimeStatus.Draft,
];

export const CLASSROOM_RUNTIME_STATUS_LABEL: Record<ClassRoomRuntimeStatus, string> = {
  [ClassRoomRuntimeStatus.All]: "Tất cả",
  [ClassRoomRuntimeStatus.Ongoing]: "Đang diễn ra",
  [ClassRoomRuntimeStatus.Today]: "Diễn ra hôm nay",
  [ClassRoomRuntimeStatus.Upcoming]: "Sắp diễn ra",
  [ClassRoomRuntimeStatus.Past]: "Đã diễn ra",
  [ClassRoomRuntimeStatus.Draft]: "Bản nháp",
};

export const CLASSROOM_TYPE_LABEL: Record<ClassRoomType, string> = {
  [ClassRoomType.All]: "Tất cả",
  [ClassRoomType.Multiple]: "Chuỗi",
  [ClassRoomType.Single]: "Đơn",
};

export const CLASSROOM_STATUS_LABEL: Record<ClassRoomStatus, string> = {
  [ClassRoomStatus.All]: "Tất cả",
  [ClassRoomStatus.Active]: "Hoạt động",
  [ClassRoomStatus.Daft]: "Bản nháp",
  [ClassRoomStatus.Deactive]: "Vô hiệu hóa",
  [ClassRoomStatus.Deleted]: "Đã xó",
  [ClassRoomStatus.Pending]: "Chờ kiểm duyệt",
  [ClassRoomStatus.Publish]: "Xuất bản",
};

export const getClassRoomTypeLabel = (status: ClassRoomType) =>
  CLASSROOM_TYPE_LABEL[status] ?? CLASSROOM_TYPE_LABEL[ClassRoomType.All];

export const getClassRoomStatusLabel = (status: ClassRoomStatus) =>
  CLASSROOM_STATUS_LABEL[status] ?? CLASSROOM_STATUS_LABEL[ClassRoomStatus.All];

export const getColorClassRoomStatus = (status: ClassRoomStatus) =>
  STATUS_COLOR_MAP[status] ?? STATUS_COLOR_MAP[ClassRoomStatus.All];

export const getClassRoomRuntimeStatusLabel = (status: ClassRoomRuntimeStatus) =>
  CLASSROOM_RUNTIME_STATUS_LABEL[status] ?? CLASSROOM_RUNTIME_STATUS_LABEL[ClassRoomRuntimeStatus.All];

export const getColorClassRoomRuntimeStatus = (status: ClassRoomRuntimeStatus) =>
  RUNTIME_STATUS_COLOR_MAP[status] ?? RUNTIME_STATUS_COLOR_MAP[ClassRoomRuntimeStatus.All];

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