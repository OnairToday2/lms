"use client";
import DialogTeacherContainer, {
  DialogTeacherContainerProps,
} from "@/modules/teacher/container/DialogTeacherContainer";
import { Button, Chip, FormLabel, IconButton, Typography } from "@mui/material";
import { memo, useCallback, useState } from "react";

import { useClassRoomStore } from "@/modules/class-room-management/store/class-room-context";
import { CloseIcon } from "@/shared/assets/icons";
import { cn } from "@/utils";
import Avatar from "@/shared/ui/Avatar";

interface TeacherSelectorProps {
  sessionIndex: number;
  className?: string;
}

const TeacherSelector: React.FC<TeacherSelectorProps> = ({ sessionIndex, className }) => {
  const [open, setOpen] = useState(false);
  const setTeachers = useClassRoomStore(({ actions }) => actions.setSelectTeacher);
  const removeTeacher = useClassRoomStore(({ actions }) => actions.removeTeacher);
  const selectedTeachers = useClassRoomStore(({ state }) => state.teacherList);

  const currentSelectedList = selectedTeachers[sessionIndex];

  const handleConformSelect: DialogTeacherContainerProps["onOk"] = (teacherList) => {
    //Teacher must alway new List
    setTeachers(sessionIndex, teacherList);
  };

  const handleRemove: Exclude<TeacherItemProps["onRemove"], undefined> = useCallback((id) => {
    removeTeacher(id, sessionIndex);
  }, []);

  return (
    <>
      <div className={cn(className)}>
        <div className="flex items-center">
          <div className="pr-6">
            <FormLabel component="div">Giảng viên phụ trách</FormLabel>
            <Typography className="text-xs text-gray-600">
              Chỉ định giảng viên phụ trách nội dung, quản lý lớp học và hỗ trợ người học trong buổi học.
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="fill" onClick={() => setOpen(true)}>
              Chọn
            </Button>
          </div>
        </div>

        {currentSelectedList?.length ? (
          <div className="selected-teacher flex flex-col gap-3">
            <div className="h-6"></div>
            {currentSelectedList.map((tc) => (
              <TeacherItem
                id={tc.id}
                name={tc.profiles?.full_name || ""}
                avatarUrl={tc.profiles?.avatar}
                code={tc.employee_code}
                key={tc.id}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : null}
      </div>
      <DialogTeacherContainer
        values={currentSelectedList?.map((tc) => tc.id)}
        open={open}
        onClose={() => setOpen(false)}
        onOk={handleConformSelect}
      />
    </>
  );
};
export default TeacherSelector;

interface TeacherItemProps {
  id: string;
  name: string;
  code: string;
  className?: string;
  avatarUrl?: string | null;
  onRemove?: (id: string) => void;
}
const TeacherItem: React.FC<TeacherItemProps> = memo(({ id, name, code, avatarUrl, className, onRemove }) => {
  return (
    <div className={cn("teacher flex items-center justify-between", className)}>
      <div className=" flex items-center gap-2">
        <div className="tc-avatar w-8 h-8 rounded-full relative overflow-hidden">
          <Avatar src={avatarUrl} alt={name} />
        </div>
        <div className="flex items-center justify-center gap-1">
          <Typography sx={{ fontSize: "0.875rem" }}>{name}</Typography>
          <Chip label={code} color="primary" variant="outlined" />
        </div>
      </div>
      <IconButton className="w-6 h-6" onClick={() => onRemove?.(id)}>
        <CloseIcon className="w-4 h-4" />
      </IconButton>
    </div>
  );
});
