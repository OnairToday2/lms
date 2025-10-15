import dayjs from "dayjs";
import { Course } from "../types/types";

const now = dayjs();

const buildSession = ({
  id,
  offsetStartMinutes,
  durationMinutes,
  title,
}: {
  id: string;
  offsetStartMinutes: number;
  durationMinutes: number;
  title: string;
}) => {
  const start = now.add(offsetStartMinutes, "minute");
  return {
    id,
    title,
    startAt: start.toISOString(),
    endAt: start.add(durationMinutes, "minute").toISOString(),
    isOnline: true,
    roomUrl: `https://onair.example.com/room/${id}`,
  };
};

export const mockCourses: Course[] = [
  {
    id: "course-ongoing-single",
    title: "Kỹ năng giao tiếp trong môi trường làm việc",
    description:
      "Khóa học tập trung vào việc cải thiện kỹ năng giao tiếp nội bộ và với khách hàng.",
    status: "published",
    roomType: "single",
    createdAt: now.subtract(7, "day").toISOString(),
    sessions: [
      {
        id: "session-ongoing-1",
        title: "Buổi học trực tuyến",
        startAt: now.subtract(30, "minute").toISOString(),
        endAt: now.add(60, "minute").toISOString(),
        isOnline: true,
        roomUrl: "https://onair.example.com/room/session-ongoing-1",
      },
    ],
    assignedParticipants: [
      {
        id: "participant-1",
        userCode: "EMP001",
        fullName: "Nguyễn Văn A",
        email: "vana@example.com",
        phoneNumber: "0901234567",
        department: "Kinh doanh",
        branch: "Hà Nội",
        assignedAt: now.subtract(2, "day").toISOString(),
        attendanceStatus: "attended",
        attendAt: now.subtract(20, "minute").toISOString(),
        leaveAt: null,
      },
      {
        id: "participant-2",
        userCode: "EMP002",
        fullName: "Trần Thị B",
        email: "thib@example.com",
        phoneNumber: "0907654321",
        department: "Marketing",
        branch: "Hồ Chí Minh",
        assignedAt: now.subtract(3, "day").toISOString(),
        attendanceStatus: "pending",
      },
      {
        id: "participant-3",
        userCode: "EMP003",
        fullName: "Lê Văn C",
        email: "vanc@example.com",
        phoneNumber: "0987654321",
        department: "Kế toán",
        branch: "Đà Nẵng",
        assignedAt: now.subtract(1, "day").toISOString(),
        attendanceStatus: "absent",
      },
    ],
    attendees: [
      {
        id: "participant-1",
        userCode: "EMP001",
        fullName: "Nguyễn Văn A",
        email: "vana@example.com",
        phoneNumber: "0901234567",
        department: "Kinh doanh",
        branch: "Hà Nội",
        assignedAt: now.subtract(2, "day").toISOString(),
        attendanceStatus: "attended",
        attendAt: now.subtract(20, "minute").toISOString(),
        leaveAt: null,
      },
    ],
    metadata: {
      level: "intermediate",
    },
  },
  {
    id: "course-today-single",
    title: "Quản lý thời gian hiệu quả",
    description:
      "Khóa học giúp nhân viên tối ưu hóa lịch làm việc hàng ngày.",
    status: "published",
    roomType: "single",
    createdAt: now.subtract(10, "day").toISOString(),
    sessions: [
      {
        id: "session-today-1",
        title: "Buổi học ngày hôm nay",
        startAt: now.add(120, "minute").toISOString(),
        endAt: now.add(240, "minute").toISOString(),
        isOnline: true,
        roomUrl: "https://onair.example.com/room/session-today-1",
      },
    ],
    assignedParticipants: [
      {
        id: "participant-4",
        userCode: "EMP004",
        fullName: "Phạm Thị D",
        email: "thid@example.com",
        phoneNumber: "0900000004",
        department: "Nhân sự",
        branch: "Hà Nội",
        assignedAt: now.subtract(4, "day").toISOString(),
      },
    ],
    attendees: [],
  },
  {
    id: "course-upcoming-series",
    title: "Chuỗi đào tạo kỹ năng lãnh đạo",
    description:
      "Bao gồm 3 buổi đào tạo cho đội ngũ quản lý cấp trung chuẩn bị cho các dự án lớn.",
    status: "published",
    roomType: "series",
    createdAt: now.subtract(30, "day").toISOString(),
    sessions: [
      buildSession({
        id: "session-series-1",
        offsetStartMinutes: 24 * 60, // tomorrow
        durationMinutes: 120,
        title: "Lãnh đạo bản thân",
      }),
      buildSession({
        id: "session-series-2",
        offsetStartMinutes: 24 * 60 * 2 + 180, // 2 days + 3 hours
        durationMinutes: 150,
        title: "Lãnh đạo đội nhóm",
      }),
      buildSession({
        id: "session-series-3",
        offsetStartMinutes: 24 * 60 * 5, // 5 days
        durationMinutes: 120,
        title: "Lãnh đạo chuyển đổi",
      }),
    ],
    assignedParticipants: [
      {
        id: "participant-5",
        userCode: "EMP005",
        fullName: "Vũ Minh E",
        email: "minhe@example.com",
        phoneNumber: "0900000005",
        department: "Vận hành",
        branch: "Hà Nội",
        assignedAt: now.subtract(6, "day").toISOString(),
        sessionIds: ["session-series-1", "session-series-2", "session-series-3"],
      },
      {
        id: "participant-6",
        userCode: "EMP006",
        fullName: "Hoàng Thị F",
        email: "thif@example.com",
        phoneNumber: "0900000006",
        department: "Kinh doanh",
        branch: "Hồ Chí Minh",
        assignedAt: now.subtract(5, "day").toISOString(),
        sessionIds: ["session-series-2"],
      },
    ],
    attendees: [],
  },
  {
    id: "course-past-single",
    title: "An toàn lao động tại nhà máy",
    description: "Những quy định cập nhật về an toàn lao động.",
    status: "published",
    roomType: "single",
    createdAt: now.subtract(60, "day").toISOString(),
    sessions: [
      {
        id: "session-past-1",
        title: "Đào tạo trực tuyến",
        startAt: now.subtract(7, "day").toISOString(),
        endAt: now.subtract(7, "day").add(120, "minute").toISOString(),
        isOnline: true,
        roomUrl: "https://onair.example.com/room/session-past-1",
      },
    ],
    assignedParticipants: [
      {
        id: "participant-7",
        userCode: "EMP007",
        fullName: "Đặng Văn G",
        email: "vang@example.com",
        phoneNumber: "0900000007",
        department: "Sản xuất",
        branch: "Hải Phòng",
        assignedAt: now.subtract(12, "day").toISOString(),
        attendanceStatus: "attended",
        attendAt: now.subtract(7, "day").add(10, "minute").toISOString(),
        leaveAt: now.subtract(7, "day").add(110, "minute").toISOString(),
      },
    ],
    attendees: [
      {
        id: "participant-7",
        userCode: "EMP007",
        fullName: "Đặng Văn G",
        email: "vang@example.com",
        phoneNumber: "0900000007",
        department: "Sản xuất",
        branch: "Hải Phòng",
        assignedAt: now.subtract(12, "day").toISOString(),
        attendanceStatus: "attended",
        attendAt: now.subtract(7, "day").add(10, "minute").toISOString(),
        leaveAt: now.subtract(7, "day").add(110, "minute").toISOString(),
      },
    ],
  },
  {
    id: "course-series-mixed",
    title: "Chuỗi chia sẻ quy trình nội bộ",
    description:
      "Chuỗi 4 buổi cập nhật quy trình, trong đó một số buổi đã diễn ra.",
    status: "published",
    roomType: "series",
    createdAt: now.subtract(15, "day").toISOString(),
    sessions: [
      {
        id: "session-mixed-1",
        title: "Quy trình kiểm kê",
        startAt: now.subtract(1, "day").toISOString(),
        endAt: now.subtract(1, "day").add(90, "minute").toISOString(),
        isOnline: true,
        roomUrl: "https://onair.example.com/room/session-mixed-1",
      },
      {
        id: "session-mixed-2",
        title: "Quy trình mua sắm",
        startAt: now.add(60, "minute").toISOString(),
        endAt: now.add(180, "minute").toISOString(),
        isOnline: true,
        roomUrl: "https://onair.example.com/room/session-mixed-2",
      },
      {
        id: "session-mixed-3",
        title: "Quy trình bảo trì",
        startAt: now.add(24 * 60 * 3, "minute").toISOString(),
        endAt: now.add(24 * 60 * 3, "minute").add(120, "minute").toISOString(),
        isOnline: true,
        roomUrl: "https://onair.example.com/room/session-mixed-3",
      },
      {
        id: "session-mixed-4",
        title: "Quy trình báo cáo",
        startAt: now.add(24 * 60 * 4, "minute").toISOString(),
        endAt: now.add(24 * 60 * 4, "minute").add(150, "minute").toISOString(),
        isOnline: true,
        roomUrl: "https://onair.example.com/room/session-mixed-4",
      },
    ],
    assignedParticipants: [
      {
        id: "participant-8",
        userCode: "EMP008",
        fullName: "Tạ Thị H",
        email: "thih@example.com",
        phoneNumber: "0900000008",
        department: "Vận hành",
        branch: "Hà Nội",
        assignedAt: now.subtract(8, "day").toISOString(),
        sessionIds: [
          "session-mixed-1",
          "session-mixed-2",
          "session-mixed-3",
          "session-mixed-4",
        ],
        attendanceStatus: "attended",
        attendAt: now.subtract(1, "day").add(5, "minute").toISOString(),
        leaveAt: now.subtract(1, "day").add(95, "minute").toISOString(),
      },
      {
        id: "participant-9",
        userCode: "EMP009",
        fullName: "Mai Văn I",
        email: "vani@example.com",
        phoneNumber: "0900000009",
        department: "CNTT",
        branch: "Đà Nẵng",
        assignedAt: now.subtract(7, "day").toISOString(),
        sessionIds: ["session-mixed-2", "session-mixed-3"],
      },
    ],
    attendees: [
      {
        id: "participant-8",
        userCode: "EMP008",
        fullName: "Tạ Thị H",
        email: "thih@example.com",
        phoneNumber: "0900000008",
        department: "Vận hành",
        branch: "Hà Nội",
        assignedAt: now.subtract(8, "day").toISOString(),
        attendanceStatus: "attended",
        attendAt: now.subtract(1, "day").add(5, "minute").toISOString(),
        leaveAt: now.subtract(1, "day").add(95, "minute").toISOString(),
        sessionIds: ["session-mixed-1"],
      },
    ],
  },
  {
    id: "course-draft",
    title: "Khóa học thử nghiệm - bản nháp",
    description: "Khóa học đang trong quá trình chuẩn bị nội dung.",
    status: "draft",
    roomType: "single",
    createdAt: now.subtract(1, "day").toISOString(),
    sessions: [
      {
        id: "session-draft-1",
        title: "Buổi học dự kiến",
        startAt: now.add(7, "day").toISOString(),
        endAt: now.add(7, "day").add(120, "minute").toISOString(),
        isOnline: true,
      },
    ],
    assignedParticipants: [],
    attendees: [],
  },
];
