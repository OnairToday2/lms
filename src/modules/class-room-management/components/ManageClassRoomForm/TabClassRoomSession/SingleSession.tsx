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
import ClassRoomSessionFromToDate from "./ClassRoomSessionFromToDate";
import TeacherSelectionContainer from "../TeacherSelectionContainer";
import DialogTeacherContainer from "@/modules/teacher/container/DialogTeacherContainer";
interface SingleSessionProps {}
const SingleSession: React.FC<SingleSessionProps> = () => {
  const { control, getValues } = useFormContext<ClassRoom>();

  const { fields: classSessionsFields } = useFieldArray({
    control,
    name: "classRoomSessions",
    keyName: "_sessionId",
    rules: {
      minLength: 1,
      maxLength: 1,
    },
  });

  return (
    <div>
      {classSessionsFields.map((sessionField, _index) => (
        <div key={sessionField._sessionId}>
          <div className="flex flex-col gap-6 bg-white rounded-xl p-6 mb-6">
            <ClassRoomSessionFromToDate index={_index} control={control} />
            <EmployeeQuantity control={control} fieldIndex={_index} />
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
            </div>
          </div>

          <TeacherSelectionContainer />
        </div>
      ))}
    </div>
  );
};
export default SingleSession;
