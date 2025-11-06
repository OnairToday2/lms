"use client";
import { ChevronRightDoubleIcon } from "@/shared/assets/icons";
import { Button, Typography } from "@mui/material";
import RoomTypeItems from "./RoomTypeItems";
import { ClassRoomPlatformType } from "@/constants/class-room.constant";
import { useState } from "react";
import { cn } from "@/utils";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ClassRoomType } from "@/model/class-room.model";

interface BoxMenuClassListProps {
  items?: { path: string; title: string }[];
}
const BoxMenuClassList: React.FC<BoxMenuClassListProps> = ({ items }) => {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const [manageType, setManageType] = useState<"classRoom" | "course">("classRoom");
  const [platform, setPlatform] = useState<ClassRoomPlatformType>("offline");
  const [roomType, setRoomType] = useState<ClassRoomType>();

  const handleSelectManageType = (type: "classRoom" | "course", platform?: ClassRoomPlatformType) => () => {
    setManageType(type);
    if (platform) setPlatform(platform);
  };

  const handleClickOk = () => {
    startTransition(() => {
      router.push(`/admin/class-room/${platform}/create`);
    });
  };
  return (
    <div className="bg-white rounded-2xl p-8 max-w-[1040px] mx-auto">
      <Typography className="font-semibold text-center text-2xl">Chọn loại lớp học</Typography>
      <div className="h-8"></div>
      <div className="grid grid-cols-3 gap-6 bg-gray-100 px-5 py-3 rounded-lg">
        <BoxMenuClassItem
          title="Lớp học trực tuyến (Live)"
          description="Buổi học diễn ra qua nền tảng trực tuyến. Người tham gia có thể học ở bất kỳ đâu chỉ với kết nối Internet."
          isActive={platform === "online" && manageType === "classRoom"}
          onClick={handleSelectManageType("classRoom", "online")}
        />
        <BoxMenuClassItem
          title="Lớp học trực tiếp (In-house)"
          description="Buổi học tổ chức tại địa điểm thực tế. Học viên tham gia gặp gỡ, trao đổi và trải nghiệm trực tiếp cùng
            giảng viên."
          isActive={platform === "offline" && manageType === "classRoom"}
          onClick={handleSelectManageType("classRoom", "offline")}
        />
        <BoxMenuClassItem
          title="Môn học eLearning"
          description="Khóa học học qua video và tài liệu số. Học viên có thể học bất cứ lúc nào, theo tiến độ riêng của mình."
          isActive={manageType === "course"}
          onClick={handleSelectManageType("course")}
        />
      </div>
      <div className="h-6"></div>
      <RoomTypeItems value={roomType} setRoomType={setRoomType} />
      <div className="h-6"></div>
      <div className="py-2 text-center">
        <Button
          onClick={handleClickOk}
          disabled={isLoading}
          loading={isLoading}
          endIcon={<ChevronRightDoubleIcon />}
          size="large"
        >
          Bắt đầu ngay
        </Button>
      </div>
    </div>
  );
};
export default BoxMenuClassList;

interface BoxMenuClassItemProps {
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
  title?: string;
  description?: React.ReactNode;
}
const BoxMenuClassItem: React.FC<BoxMenuClassItemProps> = ({ isActive, title, onClick, description }) => {
  return (
    <div
      onClick={onClick}
      className={cn("px-4 py-3 rounded-xl cursor-pointer", {
        "bg-white shadow-[0px_0px_6px_-8px_rgb(0,0,0,0.3),0px_0px_16px_-12px_rgb(0,0,0,0.4)]": isActive,
      })}
    >
      <Typography variant="h5" className="mb-3 text-base">
        {title}
      </Typography>
      {typeof description === "string" ? (
        <Typography className="text-xs text-gray-600">{description}</Typography>
      ) : (
        <div className="description">{description}</div>
      )}
    </div>
  );
};
