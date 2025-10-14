"use client";
import TextField from "@/shared/ui/form/RHFTextField";
import { Form, useFieldArray } from "react-hook-form";
import { useForm } from "react-hook-form";
import RHFDateTimePicker from "@/shared/ui/form/RHFDateTimePicker";
import RHFRadioGroupField from "@/shared/ui/form/RHFRadioGroupField";
import { useFormContext } from "react-hook-form";
import { ClassRoom } from "../../classroom-form.schema";
import { Button, FormLabel, Typography } from "@mui/material";
import FAQsFields from "./FAQsFields";
interface TabClassRoomResourceProps {}
const TabClassRoomResource = () => {
  const { control } = useFormContext<ClassRoom>();
  const { fields: classSessionsFields } = useFieldArray({
    control,
    name: "classRoomSessions",
    keyName: "_fieldId",
    rules: {
      minLength: 1,
    },
  });
  return (
    <>
      <FAQsFields />
      <div className="bg-white rounded-xl p-6 flex items-center">
        <div className="pr-6">
          <FormLabel component="div">Giảng viên phụ trách</FormLabel>
          <Typography className="text-xs text-gray-600">
            Chỉ định giảng viên phụ trách nội dung, quản lý lớp học và hỗ trợ người học trong buổi học.
          </Typography>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="fill">Chọn</Button>
        </div>
      </div>
    </>
  );
};
export default TabClassRoomResource;
