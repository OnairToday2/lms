import { ClassRoomRuntimeStatus, ClassRoomStatus, ClassRoomType, ClassSessionMode } from "../types/types";

export const TABLE_HEAD = [
    { id: "stt", label: "STT", width: 72, align: "center" as const },
    { id: "name", label: "Tên lớp học", width: 300, align: "left" as const },
    { id: "teachers", label: "Giảng viên", width: 180, align: "center" as const },
    { id: "students", label: "Số lượng học viên", width: 160, align: "center" as const },
    { id: "status", label: "Trạng thái xuất bản", width: 180, align: "center" as const },
    { id: "runtimeStatus", label: "Trạng thái diễn ra", width: 180, align: "center" as const },
    { id: "createdBy", label: "Người tạo", width: 240, align: "left" as const },
    { id: "action", label: "Hành động", width: 100, align: "center" as const },
];

export const RUNTIME_STATUS_OPTIONS = [
    { label: "Tất cả", value: ClassRoomRuntimeStatus.All, display: true },
    { label: "Đang diễn ra", value: ClassRoomRuntimeStatus.Ongoing, display: true },
    { label: "Diễn ra hôm nay", value: ClassRoomRuntimeStatus.Today, display: true },
    { label: "Sắp diễn ra", value: ClassRoomRuntimeStatus.Upcoming, display: true },
    { label: "Đã diễn ra", value: ClassRoomRuntimeStatus.Past, display: true },
    { label: "Nháp", value: ClassRoomRuntimeStatus.Draft, display: false },
];

export const PUBLICATION_STATUS_OPTIONS = [
    { label: "Tất cả", value: ClassRoomStatus.All, display: true },
    { label: "Bản nháp", value: ClassRoomStatus.Daft, display: true },
    { label: "Chờ kiểm duyệt", value: ClassRoomStatus.Pending, display: true },
    { label: "Xuất bản", value: ClassRoomStatus.Publish, display: true },
    { label: "Đang hoạt động", value: ClassRoomStatus.Active, display: true },
    { label: "Bị tạm dừng", value: ClassRoomStatus.Deactive, display: false },
    { label: "Đã xoá", value: ClassRoomStatus.Deleted, display: false },
];

export const TYPE_OPTIONS = [
    { label: "Tất cả", value: ClassRoomType.All, display: true },
    { label: "Đơn", value: ClassRoomType.Single, display: true },
    { label: "Chuỗi", value: ClassRoomType.Multiple, display: true },
];

export const SESSION_MODE_OPTIONS = [
    { label: "Tất cả", value: ClassSessionMode.All, display: true },
    { label: "Online", value: ClassSessionMode.Online, display: true },
    { label: "Offline", value: ClassSessionMode.Offline, display: true },
];
