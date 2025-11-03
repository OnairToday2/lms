"use client";
import { IconButton, Typography } from "@mui/material";
import StudentsContainer, { StudentsContainerProps } from "./StudentsContainer";
import { useClassRoomStore } from "@/modules/class-room-management/store/class-room-context";
import { StudentSelectedItem } from "@/modules/class-room-management/store/class-room-store";
import QrSetting from "./QrSetting";
import { ChevronDownIcon } from "@/shared/assets/icons";
import { useClassRoomFormContext } from "../ClassRoomFormContainer";

const TabClassRoomSetting = () => {
  const { control, getValues } = useClassRoomFormContext();
  const classRoomPlatform = getValues("platform");

  const setStudents = useClassRoomStore((state) => state.actions.setSelectedStudents);
  const selectedStudents = useClassRoomStore((state) => state.state.selectedStudents);

  const handleSelect: StudentsContainerProps["onChange"] = (employees) => {
    const students = employees.map<StudentSelectedItem>((item) => ({
      id: item.id,
      avatar: item.avatar,
      email: item.email,
      empoyeeType: item.empoyeeType,
      employeeCode: item.employeeCode,
      fullName: item.fullName,
    }));
    setStudents(students);
  };

  return (
    <div className="flex flex-col gap-6">
      {classRoomPlatform === "online" ? null : <QrSetting />}
      <div className="bg-white p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <Typography component="h3" sx={{ fontSize: "16px", fontWeight: "bold" }}>
            Thêm học viên <span className="text-red-600">*</span>
          </Typography>
        </div>
        <StudentsContainer seletedItems={selectedStudents} onChange={handleSelect} />
      </div>
    </div>
  );
};
export default TabClassRoomSetting;
