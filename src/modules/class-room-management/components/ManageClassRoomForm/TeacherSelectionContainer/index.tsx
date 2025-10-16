import DialogTeacherContainer, {
  DialogTeacherContainerProps,
} from "@/modules/teacher/container/DialogTeacherContainer";
import { Button, FormLabel, Typography } from "@mui/material";
import { useState } from "react";
interface TeacherSelectionContainerProps {}

const TeacherSelectionContainer: React.FC<TeacherSelectionContainerProps> = () => {
  const [open, setOpen] = useState(false);

  const handleConformSelect: DialogTeacherContainerProps["onOk"] = (data) => {
    console.log(data);
  };
  return (
    <>
      <div className="bg-white rounded-xl p-6 flex items-center">
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
      <DialogTeacherContainer open={open} onClose={() => setOpen(false)} onOk={handleConformSelect} />
    </>
  );
};
export default TeacherSelectionContainer;
