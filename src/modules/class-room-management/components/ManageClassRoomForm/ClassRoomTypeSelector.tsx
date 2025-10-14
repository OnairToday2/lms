import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { ClassRoomType } from "@/model/class-room.model";
import { memo, useState } from "react";
import { cn } from "@/utils";
import { ChevronRightDoubleIcon } from "@/shared/assets/icons";
export interface ClassRoomTypeSelectorProps {
  className?: string;
  onSelect: (type: Exclude<ClassRoomType, null>) => void;
  value?: Exclude<ClassRoomType, null>;
}
const ClassRoomTypeSelector: React.FC<ClassRoomTypeSelectorProps> = ({ className, onSelect, value }) => {
  const [roomType, setRoomType] = useState<Exclude<ClassRoomType, null> | undefined>(value);

  const confirmSelectType = () => {
    if (!roomType) return;
    onSelect?.(roomType);
  };
  return (
    <div className="flex flex-col gap-6 justify-center items-center">
      <div className="class-room-type-selector grid grid-cols-2 gap-6">
        <SelectItem
          thumbnail={
            <Image src="/assets/icons/calendar-1.svg" alt="icon calendar" width={56} height={56} className="mb-4" />
          }
          title="Lớp học trực tuyến đơn"
          description="Diễn ra trong một buổi duy nhất với thời gian cố định."
          isActive={roomType === "single"}
          onClick={() => setRoomType("single")}
        />

        <SelectItem
          thumbnail={
            <Image src="/assets/icons/calendar-2.svg" alt="icon calendar" width={56} height={56} className="mb-4" />
          }
          title="Lớp học trực tuyến chuỗi"
          description="Gồm nhiều lớp học trong một chương trình, diễn ra vào các khung giờ khác nhau."
          isActive={roomType === "multiple"}
          onClick={() => setRoomType("multiple")}
        />
      </div>
      <Button onClick={confirmSelectType} disabled={!roomType} endIcon={<ChevronRightDoubleIcon />} size="large">
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
        "!border-blue-600": isActive,
      })}
      onClick={onClick}
    >
      {thumbnail}
      <div>
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
