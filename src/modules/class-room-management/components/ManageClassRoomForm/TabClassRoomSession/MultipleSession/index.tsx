"use client";
import { type ClassRoom } from "../../../classroom-form.schema";
import { Button, Divider, FormLabel, Typography } from "@mui/material";
import RHFRadioGroupField from "@/shared/ui/form/RHFRadioGroupField";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import EmployeeQuantity from "../EmpoyeeQuantity";
import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import ClassRoomSessionFromToDate from "../ClassRoomSessionFromToDate";
import SessionAccordion from "./SessionAccordion";
import PlusIcon from "@/shared/assets/icons/PlusIcon";
import { useCallback } from "react";
import RHFRichEditor from "@/shared/ui/form/RHFRichEditor";

export const getClassSessionInitData = (): ClassRoom["classRoomSessions"][number] => {
  return {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    channelInfo: { url: "", password: "", providerId: "" },
    channelProvider: "zoom",
    thumbnailUrl: "",
    isOnline: true,
    agendas: [],
    limitPerson: 0,
    isUnlimited: false,
    id: undefined,
    recourses: [],
  };
};

const MultipleSession = () => {
  const {
    control,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<ClassRoom>();

  const {
    fields: classSessionsFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "classRoomSessions",
    keyName: "_sessionId",
    rules: {
      minLength: 2,
    },
  });

  const watchTitleChange = useCallback((index: number) => {
    return watch(`classRoomSessions.${index}.title`);
  }, []);

  const hasErrorSession = (index: number) => {
    return !!errors.classRoomSessions?.[index];
  };
  const handleAddClassSession = async () => {
    const isValid = await trigger("classRoomSessions");
    console.log(isValid);
    if (!isValid) return;
    const initValue = getClassSessionInitData();
    append({ ...initValue });
  };
  const handleRemoveItem = () => {};
  return (
    <div className="sesion-multiple">
      <div className="inner bg-white rounded-xl p-6 mb-6">
        <div className="mb-6">
          <Typography component="h3" className="text-base font-semibold">
            Chi tiết chuỗi lớp học
          </Typography>
        </div>
        <div className="session-list flex flex-col gap-6">
          {classSessionsFields.map((sessionField, _index) => (
            <div key={sessionField._sessionId}>
              <SessionAccordion index={_index} title={watchTitleChange(_index)}>
                <div className="pt-6">
                  <div className="flex flex-col gap-6">
                    <RHFTextField
                      control={control}
                      label="Tên lớp học"
                      placeholder="Tên lớp học"
                      name={`classRoomSessions.${_index}.title`}
                      required
                      helpText={<Typography className="text-xs text-gray-600 text-right">Tối đa 100 ký tự</Typography>}
                    />
                    <ClassRoomSessionFromToDate index={_index} control={control} />
                    <RHFRichEditor
                      control={control}
                      name={`classRoomSessions.${_index}.description`}
                      placeholder="Nội dung"
                      label="Nội dung"
                      required
                    />
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
                  <div className="h-6"></div>
                  <div className="flex items-center">
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
              </SessionAccordion>
            </div>
          ))}
        </div>
        <div className="h-6"></div>
        <Divider>
          <Button variant="outlined" color="inherit" startIcon={<PlusIcon />} onClick={handleAddClassSession}>
            Thêm mới
          </Button>
        </Divider>
      </div>
    </div>
  );
};
export default MultipleSession;
