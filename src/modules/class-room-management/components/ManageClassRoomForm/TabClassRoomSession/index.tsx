"use client";
import TextField from "@/shared/ui/form/RHFTextField";
import { type ClassRoom } from "../../classroom-form.schema";
import { Button, FormLabel, Typography } from "@mui/material";
import RHFDateTimePicker from "@/shared/ui/form/RHFDateTimePicker";
import RHFRadioGroupField from "@/shared/ui/form/RHFRadioGroupField";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import EmployeeQuantity from "./EmpoyeeQuantity";
import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
const TabClassRoomSession = () => {
  const { control } = useFormContext<ClassRoom>();
  const { fields: classSessionsFields } = useFieldArray({
    control,
    name: "classRoomSessions",
    keyName: "_sessionId",
    rules: {
      minLength: 1,
    },
  });

  return (
    <div>
      {classSessionsFields.map((sessionField, _index) => (
        <div key={sessionField._sessionId}>
          <div className="flex flex-col gap-6 bg-white rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <RHFDateTimePicker
                control={control}
                name={`classRoomSessions.${_index}.startDate`}
                label="Thời gian bắt đầu"
                required
              />
              <RHFDateTimePicker
                control={control}
                name={`classRoomSessions.${_index}.endDate`}
                label="Thời gian kết thúc"
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <RHFRadioGroupField
                label="Nền tảng"
                name={`classRoomSessions.${_index}.channelProvider`}
                control={control}
                direction="horizontal"
                options={[
                  { value: "zoom", label: "Zoom" },
                  { value: "google_meet", label: "Google Meet" },
                  { value: "microsoft_teams", label: "Microsoft Teams" },
                ]}
              />
              <RHFTextField
                name={`classRoomSessions.${_index}.channelInfo.url`}
                control={control}
                label="Link tham dự"
                placeholder="https://..."
              />
              <div className="flex items-center gap-4">
                <RHFTextField
                  name={`classRoomSessions.${_index}.channelInfo.providerId`}
                  control={control}
                  label="Meeting ID"
                  placeholder="123 456 888"
                />
                <RHFTextField
                  name={`classRoomSessions.${_index}.channelInfo.password`}
                  control={control}
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <EmployeeQuantity control={control} fieldIndex={_index} />
            </div>
          </div>
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
        </div>
      ))}
    </div>
  );
};
export default TabClassRoomSession;
