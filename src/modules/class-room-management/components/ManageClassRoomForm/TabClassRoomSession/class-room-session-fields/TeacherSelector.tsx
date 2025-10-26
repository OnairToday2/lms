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
import { TeacherSelectedItem } from "@/modules/class-room-management/store/class-room-store";

interface TeacherSelectorProps {
  sessionIndex: number;
  className?: string;
}

const TeacherSelector: React.FC<TeacherSelectorProps> = ({ sessionIndex, className }) => {
  const [open, setOpen] = useState(false);
  const setSelectedTeachers = useClassRoomStore(({ actions }) => actions.setSelectedTeachers);
  const removeTeacher = useClassRoomStore(({ actions }) => actions.removeTeacher);
  const selectedTeachers = useClassRoomStore(({ actions }) => actions.getTeachersByIndexSession(sessionIndex));

  const handleConformSelect: DialogTeacherContainerProps["onOk"] = (teachers) => {
    //Teacher must alway new List
    const teacherList = teachers.map<TeacherSelectedItem>((item) => ({
      avatar: item.profiles.avatar,
      id: item.id,
      fullName: item.profiles.full_name,
      empoyeeType: item.employee_type,
      employeeCode: item.employee_code,
      email: item.profiles.email,
    }));
    setSelectedTeachers(sessionIndex, teacherList);
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

        {selectedTeachers?.length ? (
          <div className="selected-teacher flex flex-col gap-3">
            <div className="h-6"></div>
            {selectedTeachers.map((tc) => (
              <TeacherItem
                id={tc.id}
                name={tc.fullName}
                avatarUrl={tc.avatar}
                code={tc.employeeCode}
                key={tc.id}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : null}
      </div>
      <DialogTeacherContainer
        values={selectedTeachers?.map((tc) => tc.id)}
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
