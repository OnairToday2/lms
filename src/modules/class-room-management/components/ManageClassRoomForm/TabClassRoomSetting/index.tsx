"use client";
import { Typography } from "@mui/material";
import StudentsContainer, { StudentsContainerProps } from "./StudentsContainer";
import { useClassRoomStore } from "@/modules/class-room-management/store/class-room-context";

const TabClassRoomSetting = () => {
  const setStudents = useClassRoomStore((state) => state.actions.setStudents);

  const stulist = useClassRoomStore((state) => state.state.studentList);

  console.log(stulist);
  const handleSelect: StudentsContainerProps["onChange"] = (employees) => {
    setStudents(employees);
  };
  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <Typography component="h3" sx={{ fontSize: "16px", fontWeight: "bold" }}>
          Thêm học viên <span className="text-red-600">*</span>
        </Typography>
      </div>
      <StudentsContainer seletedItems={stulist} onChange={handleSelect} />
    </div>
  );
};
export default TabClassRoomSetting;
