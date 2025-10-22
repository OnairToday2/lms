import { ClassRoomRuntimeStatus, ClassRoomStatus } from "../types/types";

export const TABLE_HEAD = [
    { id: "stt", label: "STT", width: 72 },
    { id: "name", label: "Tên lớp học", width: 300 },
    { id: "teachers", label: "Giảng viên", width: 180 },
    { id: "students", label: "Số lượng học viên", width: 160 },
    { id: "status", label: "Trạng thái xuất bản", width: 180 },
    { id: "runtimeStatus", label: "Trạng thái diễn ra", width: 180 },
    { id: "createdBy", label: "Người tạo", width: 240 },
    { id: "action", label: "", width: 0 },
]

export const RUNTIME_STATUS_OPTIONS = [
    { label: "Tất cả", value: ClassRoomRuntimeStatus.All },
    { label: "Đang diễn ra", value: ClassRoomRuntimeStatus.Ongoing },
    { label: "Diễn ra hôm nay", value: ClassRoomRuntimeStatus.Today },
    { label: "Sắp diễn ra", value: ClassRoomRuntimeStatus.Upcoming },
    { label: "Đã diễn ra", value: ClassRoomRuntimeStatus.Past },
    { label: "Nháp", value: ClassRoomRuntimeStatus.Draft },
];

export const PUBLICATION_STATUS_OPTIONS = [
    { label: "Tất cả", value: ClassRoomStatus.All },
    { label: "Bản nháp", value: ClassRoomStatus.Daft },
    { label: "Chờ kiểm duyệt", value: ClassRoomStatus.Pending },
    { label: "Xuất bản", value: ClassRoomStatus.Publish },
    { label: "Đang hoạt động", value: ClassRoomStatus.Active },
    { label: "Bị tạm dừng", value: ClassRoomStatus.Deactive },
    { label: "Đã xoá", value: ClassRoomStatus.Deleted },
];