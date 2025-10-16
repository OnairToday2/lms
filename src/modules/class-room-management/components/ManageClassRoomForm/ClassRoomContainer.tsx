"use client";
import * as React from "react";

import TabClassRoomInformation from "./TabClassRoomInformation";
import TabClassRoomResource from "./TabClassRoomResource";
import TabClassRoomSession from "./TabClassRoomSession";
import TabClassRoomSetting from "./TabClassRoomSetting";
import { FormProvider, SubmitHandler, useForm, UseFormHandleSubmit, UseFormReturn } from "react-hook-form";
import { classRoomSchema, ClassRoom } from "../classroom-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, IconButton } from "@mui/material";
import ClassRoomTabContainer, { ClassRoomTabContainerProps } from "./ClassRoomTabContainer";
import { getClassRoomTabValidationStatus } from "./utils";
import { CalendarDateIcon, ClipboardIcon, CloseIcon, EyeIcon, InforCircleIcon } from "@/shared/assets/icons";
import { UsersIcon2 } from "@/shared/assets/icons";
import ClassRoomPreview from "./ClassRoomPreview";
import ClassRoomTypeSelector, { ClassRoomTypeSelectorProps } from "./ClassRoomTypeSelector";
import { getClassSessionInitData } from "./TabClassRoomSession/MultipleSession";

export const CLASS_ROOM_TAB_KEYS = {
  "clsTab-information": "clsTab-information",
  "clsTab-session": "clsTab-session",
  "clsTab-resource": "clsTab-resource",
  "clsTab-setting": "clsTab-setting",
} as const;

export interface ClassRoomContainerProps {
  onSubmit?: (formData: ClassRoom) => void;
}

const ClassRoomContainer: React.FC<ClassRoomContainerProps> = () => {
  const formSubmitRef = React.useRef<boolean>(false);
  const methods = useForm<ClassRoom>({
    resolver: zodResolver(classRoomSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnailUrl: "",
      classRoomField: [],
      classRoomId: "",
      hashTags: [],
      slug: "",
      status: "draft",
      roomType: undefined,
      communityInfo: {
        name: "",
        url: "",
      },
      faqs: [],
      forWhom: [],
      whies: [],
      galleries: [],
      classRoomSessions: [getClassSessionInitData()],
    },
  });

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
    watch,
    reset,
  } = methods;

  console.log({ errors, vale: getValues() });
  const watchRoomType = watch("roomType");

  const handleSelectRoomType: ClassRoomTypeSelectorProps["onSelect"] = React.useCallback((type) => {
    setValue("roomType", type);
  }, []);

  const handleTriggerThenSubmitForm = (submitHandler: UseFormHandleSubmit<ClassRoom>) => async () => {
    formSubmitRef.current = true;
    try {
      const isValidAllClassRoomForm = await trigger();
      if (isValidAllClassRoomForm) {
        submitHandler(submitForm);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const submitForm: SubmitHandler<ClassRoom> = (data) => {
    console.log(data);
  };
  const CLASS_ROOM_TAB_LIST: ClassRoomTabContainerProps["items"] = [
    {
      tabName: "Thông tin chung",
      tabKey: CLASS_ROOM_TAB_KEYS["clsTab-information"],
      icon: <InforCircleIcon />,
      content: <TabClassRoomInformation />,
      status: formSubmitRef.current
        ? getClassRoomTabValidationStatus(errors, CLASS_ROOM_TAB_KEYS["clsTab-information"])
        : "idle",
    },
    {
      tabName: "Thời gian",
      tabKey: CLASS_ROOM_TAB_KEYS["clsTab-session"],
      icon: <CalendarDateIcon />,
      content: <TabClassRoomSession />,
      status: formSubmitRef.current
        ? getClassRoomTabValidationStatus(errors, CLASS_ROOM_TAB_KEYS["clsTab-session"])
        : "idle",
    },
    {
      tabName: "Tài nguyên",
      tabKey: CLASS_ROOM_TAB_KEYS["clsTab-resource"],
      icon: <ClipboardIcon />,
      content: <TabClassRoomResource />,
      status: formSubmitRef.current
        ? getClassRoomTabValidationStatus(errors, CLASS_ROOM_TAB_KEYS["clsTab-resource"])
        : "idle",
    },
    {
      tabName: "Thiết lập",
      tabKey: CLASS_ROOM_TAB_KEYS["clsTab-setting"],
      icon: <UsersIcon2 />,
      content: <TabClassRoomSetting />,
      status: formSubmitRef.current
        ? getClassRoomTabValidationStatus(errors, CLASS_ROOM_TAB_KEYS["clsTab-setting"])
        : "idle",
    },
  ];

  return (
    <FormProvider {...methods}>
      {!watchRoomType ? (
        <div className="max-w-[1040px] mx-auto">
          <ClassRoomTypeSelector onSelect={handleSelectRoomType} />
          <div className="h-6"></div>
        </div>
      ) : (
        <ClassRoomTabContainer
          items={CLASS_ROOM_TAB_LIST}
          previewUI={<ClassRoomPreview control={control} />}
          actions={
            <div className="flex items-center gap-2">
              <IconButton className="border rounded-lg border-gray-400 bg-white" onClick={() => reset()}>
                <CloseIcon />
              </IconButton>
              <IconButton className="border rounded-lg border-gray-400 bg-white">
                <EyeIcon />
              </IconButton>
              <Button size="large" color="inherit" variant="outlined" className="border-gray-400">
                Lưu nháp
              </Button>
              <Button size="large" onClick={handleTriggerThenSubmitForm(handleSubmit)}>
                Đăng tải
              </Button>
            </div>
          }
        />
      )}
    </FormProvider>
  );
};
export default ClassRoomContainer;
