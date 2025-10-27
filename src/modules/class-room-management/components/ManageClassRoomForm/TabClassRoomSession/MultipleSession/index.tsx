"use client";
import { type ClassRoom } from "../../../classroom-form.schema";
import { Button, Divider, Typography } from "@mui/material";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import QuantityPersonField from "../class-room-session-fields/QuantityPersonField";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import ClassRoomSessionFromToDate from "../class-room-session-fields/ClassRoomSessionFromToDate";
import AccordionSessionItem, { AccordionSessionItemProps } from "./AccordionSessionItem";
import PlusIcon from "@/shared/assets/icons/PlusIcon";
import { useState } from "react";
import RHFRichEditor from "@/shared/ui/form/RHFRichEditor";
import ClassRoomChannel from "../class-room-session-fields/RoomChannel";
import TeacherSelector from "../class-room-session-fields/TeacherSelector";
import AgendarFields from "../class-room-session-fields/AgendarFields";
import { useClassRoomFormContext } from "../../ClassRoomFormContainer";

export const initClassSessionFormData = (): ClassRoom["classRoomSessions"][number] => {
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
    resources: [],
  };
};

interface MultipleSessionProps {
  methods: UseFormReturn<ClassRoom>;
}
const MultipleSession: React.FC<MultipleSessionProps> = ({ methods }) => {
  /**
   * Session init items to validate when click add more button.
   */
  const [sessionItemInit, setSessionItemInit] = useState<{ index: number; isInit: boolean }[]>([
    {
      index: 0,
      isInit: true,
    },
  ]);
  const {
    control,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useClassRoomFormContext();

  const {
    fields: classSessionsFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "classRoomSessions",
    keyName: "_sessionId",
  });

  const hasErrorSession = (index: number): AccordionSessionItemProps["status"] => {
    if (sessionItemInit.find((it) => it.index === index)?.isInit) {
      return "idle";
    }
    return !!errors.classRoomSessions?.[index] ? "invalid" : "valid";
  };
  const handleAddClassSession = async () => {
    /**
     * Mark all section isInited
     */
    setSessionItemInit((prev) => prev.map((it) => ({ ...it, isInit: false })));

    await trigger("classRoomSessions")
      .then((valid) => {
        if (!valid) return;

        const sessionItemCount = classSessionsFields.length;
        const initSessionItem = initClassSessionFormData();
        append(initSessionItem);
        setSessionItemInit((prev) => [...prev, { index: sessionItemCount, isInit: true }]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="class-multiple-session">
      <div className="inner bg-white rounded-xl p-6 mb-6">
        <div className="mb-6">
          <Typography component="h3" className="text-base font-semibold">
            Chi tiết chuỗi lớp học
          </Typography>
        </div>
        <div className="session-list flex flex-col gap-3">
          {classSessionsFields.map((sessionField, _index) => (
            <div key={sessionField._sessionId}>
              <AccordionSessionItem
                index={_index}
                title={sessionField.title}
                onRemove={() => remove(_index)}
                status={hasErrorSession(_index)}
              >
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
                    <QuantityPersonField control={control} fieldIndex={_index} />
                    <RHFRichEditor
                      control={control}
                      name={`classRoomSessions.${_index}.description`}
                      placeholder="Nội dung"
                      label="Nội dung"
                      required
                    />
                    <ClassRoomChannel index={_index} control={control} />
                  </div>
                  <div className="h-6"></div>
                  <TeacherSelector sessionIndex={_index} />
                  <div className="h-6"></div>
                  <AgendarFields sessionIndex={_index} />
                </div>
              </AccordionSessionItem>
            </div>
          ))}
        </div>
        <div className="h-6"></div>
        <Divider>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<PlusIcon />}
            onClick={handleAddClassSession}
            size="small"
          >
            Thêm mới
          </Button>
        </Divider>
      </div>
    </div>
  );
};
export default MultipleSession;
