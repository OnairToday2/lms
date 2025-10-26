"use client";
import { Typography } from "@mui/material";
import StudentsContainer, { StudentsContainerProps } from "./StudentsContainer";
import { useClassRoomStore } from "@/modules/class-room-management/store/class-room-context";
import { StudentSelectedItem } from "@/modules/class-room-management/store/class-room-store";

const TabClassRoomSetting = () => {
  const setStudents = useClassRoomStore((state) => state.actions.setSelectedStudents);

  const selectedStudents = useClassRoomStore((state) => state.state.selectedStudents);
  console.log(selectedStudents);
  const handleSelect: StudentsContainerProps["onChange"] = (employees) => {
    const students = employees.map<StudentSelectedItem>((item) => ({
      id: item.id,
      avatar: item.profiles.avatar,
      email: item.profiles.email,
      empoyeeType: item.employee_type,
      employeeCode: item.employee_code,
      fullName: item.profiles.full_name,
    }));
    setStudents(students);
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <Typography component="h3" sx={{ fontSize: "16px", fontWeight: "bold" }}>
          Thêm học viên <span className="text-red-600">*</span>
        </Typography>
      </div>
      <StudentsContainer
        seletedItems={[]}
        selectedStudentIds={selectedStudents.map((it) => it.id)}
        onChange={handleSelect}
      />
    </div>
  );
};
export default TabClassRoomSetting;
