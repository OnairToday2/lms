"use client";
import { memo, useState } from "react";
import Image from "next/image";
import { cn } from "@/utils";
import { Box, Button, Typography } from "@mui/material";
import { ClassRoomType } from "@/model/class-room.model";
import { ChevronRightDoubleIcon } from "@/shared/assets/icons";
import { CLASS_ROOM_PLATFORM, ClassRoomPlatformType } from "@/constants/class-room.constant";
export interface ClassRoomTypeSelectorProps {
  className?: string;
  onSelect: (type: NonNullable<ClassRoomType>) => void;
  platform: ClassRoomPlatformType;
  value?: Exclude<ClassRoomType, null>;
}
const ClassRoomTypeSelector: React.FC<ClassRoomTypeSelectorProps> = ({ className, onSelect, value, platform }) => {
  const [roomType, setRoomType] = useState<Exclude<ClassRoomType, null> | undefined>(value);

  const confirmSelectType = () => {
    if (!roomType) return;
    onSelect?.(roomType);
  };

  const handleSelectRoomType = (type: ClassRoomType) => () => {
    setRoomType(type);
  };
  const isDisabledButton = !roomType || !platform;

  return (
    <div className="flex flex-col gap-6 justify-center items-center">
      {platform === "online" && (
        <div className="class-room-type-selector grid grid-cols-2 gap-6">
          <SelectItem
            thumbnail={
              <Image src="/assets/icons/calendar-1.svg" alt="icon calendar" width={56} height={56} className="mb-4" />
            }
            title="Lớp học trực tuyến đơn"
            description="Diễn ra trong một buổi duy nhất với thời gian cố định."
            isActive={roomType === "single" && platform === "online"}
            onClick={handleSelectRoomType("single")}
          />

          <SelectItem
            thumbnail={
              <Image src="/assets/icons/calendar-2.svg" alt="icon calendar" width={56} height={56} className="mb-4" />
            }
            title="Lớp học trực tuyến chuỗi"
            description="Gồm nhiều lớp học trong một chương trình, diễn ra vào các khung giờ khác nhau."
            isActive={roomType === "multiple" && platform === "online"}
            onClick={handleSelectRoomType("multiple")}
          />
        </div>
      )}
      {platform === "offline" && (
        <div className="class-room-type-selector grid grid-cols-2 gap-6">
          <SelectItem
            thumbnail={
              <Image src="/assets/icons/calendar-1.svg" alt="icon calendar" width={56} height={56} className="mb-4" />
            }
            title="Lớp học Offline đơn"
            description="Diễn ra trong một buổi duy nhất với thời gian cố định."
            isActive={roomType === "single" && platform === "offline"}
            onClick={handleSelectRoomType("single")}
          />

          <SelectItem
            thumbnail={
              <Image src="/assets/icons/calendar-2.svg" alt="icon calendar" width={56} height={56} className="mb-4" />
            }
            title="Lớp học Offline chuỗi"
            description="Gồm nhiều lớp học trong một chương trình, diễn ra vào các khung giờ khác nhau."
            isActive={roomType === "multiple" && platform === "offline"}
            onClick={handleSelectRoomType("multiple")}
          />
        </div>
      )}
      <Button onClick={confirmSelectType} disabled={isDisabledButton} endIcon={<ChevronRightDoubleIcon />} size="large">
        Bắt đầu ngay
      </Button>
    </div>
  );
};
export default memo(ClassRoomTypeSelector);

interface SelectItemProps {
  isActive?: boolean;
  title?: string;
  description?: string;
  thumbnail: React.ReactNode;
  onClick?: () => void;
}
const SelectItem: React.FC<SelectItemProps> = ({ isActive, title, description, onClick, thumbnail }) => {
  return (
    <Box
      className={cn("bg-white rounded-xl p-6 border cursor-pointer", {
        "border-transparent": !isActive,
        "border-blue-600!": isActive,
      })}
      onClick={onClick}
    >
      {thumbnail}
      <div className="select-item-content">
        {title ? (
          <Typography component="h4" className="font-bold mb-2">
            {title}
          </Typography>
        ) : null}
        {description ? (
          <Typography variant="body2" className="text-gray-600">
            {description}
          </Typography>
        ) : null}
      </div>
    </Box>
  );
};
