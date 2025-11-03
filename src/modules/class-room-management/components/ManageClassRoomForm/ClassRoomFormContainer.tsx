"use client";
import React, { useEffect, useRef, useImperativeHandle, useCallback, forwardRef } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { classRoomSchema, ClassRoom } from "../classroom-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, IconButton } from "@mui/material";
import { CalendarDateIcon, ClipboardIcon, CloseIcon, EyeIcon, GlobeIcon, UsersPlusIcon } from "@/shared/assets/icons";
import ClassRoomPreview from "./ClassRoomPreview";
import ClassRoomTypeSelector, { ClassRoomTypeSelectorProps } from "./ClassRoomTypeSelector";
import { useClassRoomStore } from "../../store/class-room-context";
import { ClassRoomStore } from "../../store/class-room-store";
import ClassRoomTabContainer, { ClassRoomTabContainerRef } from "./ClassRoomTabContainer";
import TabClassRoomInformation from "./TabClassRoomInformation";
import TabClassRoomResource from "./TabClassRoomResource";
import TabClassRoomSession, { initClassSessionFormData } from "./TabClassRoomSession";
import TabClassRoomSetting from "./TabClassRoomSetting";
import { ClassRoomPlatformType } from "@/constants/class-room.constant";
export const TAB_KEYS_CLASS_ROOM = {
  "clsTab-information": "clsTab-information",
  "clsTab-session": "clsTab-session",
  "clsTab-resource": "clsTab-resource",
  "clsTab-setting": "clsTab-setting",
} as const;

export const TAB_NODES_CLASS_ROOM = new Map([
  [
    TAB_KEYS_CLASS_ROOM["clsTab-information"],
    {
      prev: null,
      next: TAB_KEYS_CLASS_ROOM["clsTab-session"],
    },
  ],
  [
    TAB_KEYS_CLASS_ROOM["clsTab-session"],
    {
      prev: TAB_KEYS_CLASS_ROOM["clsTab-information"],
      next: TAB_KEYS_CLASS_ROOM["clsTab-resource"],
    },
  ],
  [
    TAB_KEYS_CLASS_ROOM["clsTab-resource"],
    {
      prev: TAB_KEYS_CLASS_ROOM["clsTab-session"],
      next: TAB_KEYS_CLASS_ROOM["clsTab-setting"],
    },
  ],
  [
    TAB_KEYS_CLASS_ROOM["clsTab-setting"],
    {
      prev: TAB_KEYS_CLASS_ROOM["clsTab-resource"],
      next: null,
    },
  ],
]);

export interface ClassRoomFormContainerRef {
  resetForm: () => void;
}
export interface ClassRoomFormContainerProps {
  onSubmit?: (
    formData: ClassRoom,
    selectedStudents: ClassRoomStore["state"]["selectedStudents"],
    selectedTeachers: ClassRoomStore["state"]["selectedTeachers"],
  ) => void;
  platform: ClassRoomPlatformType;
  value?: ClassRoom;
  isLoading?: boolean;
  action?: "create" | "edit";
}

export const initClassRoomFormData = (platform: ClassRoomPlatformType): Partial<ClassRoom> => {
  return {
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
    docs: [],
    platform: platform,
    classRoomSessions: [],
  };
};

const ClassRoomFormContainer = forwardRef<ClassRoomFormContainerRef, ClassRoomFormContainerProps>(
  ({ onSubmit, isLoading, action, value: initFormValue, platform }, ref) => {
    const classRoomTabContainerRef = useRef<ClassRoomTabContainerRef>(null);
    const resetStore = useClassRoomStore(({ actions }) => actions.reset);
    const selectedStudents = useClassRoomStore(({ state }) => state.selectedStudents);
    const selectedTeachers = useClassRoomStore(({ state }) => state.selectedTeachers);

    const methods = useForm<ClassRoom>({
      resolver: zodResolver(classRoomSchema),
      defaultValues: initFormValue ? { ...initFormValue, platform: platform } : initClassRoomFormData(platform),
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

    console.log({ errors, value: getValues(), selectedStudents, selectedTeachers });
    const watchRoomType = watch("roomType");

    const handleSelectRoomType: ClassRoomTypeSelectorProps["onSelect"] = useCallback((type) => {
      setValue("roomType", type);
      const initSessionsFormData = initClassSessionFormData({ isOnline: platform === "online" });

      setValue(
        "classRoomSessions",
        type === "multiple" ? [initSessionsFormData, initSessionsFormData] : [initSessionsFormData],
      );
    }, []);

    const triggerBeforeSubmitForm = (submitAction: () => void, status: "draft" | "publish") => async () => {
      try {
        setValue("status", status);
        const isValidAllClassRoomFields = await trigger();
        classRoomTabContainerRef.current?.checkStatusAllTabItems();
        if (isValidAllClassRoomFields) {
          submitAction();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const submitForm: SubmitHandler<ClassRoom> = (data) => {
      console.log({ errors, data, selectedTeachers, selectedStudents });

      const sessionList = getValues("classRoomSessions");
      const isEverySessionHasTeacher = sessionList.every((session, _index) => {
        return Boolean(selectedTeachers[_index]?.length);
      });

      if (!isEverySessionHasTeacher) {
        console.error("Some class session is Empty teacher");
        classRoomTabContainerRef.current?.setTabStatus("clsTab-session", "invalid");
        return;
      }

      if (!selectedStudents.length) {
        console.error("Students is Empty ");
        classRoomTabContainerRef.current?.setTabStatus("clsTab-setting", "invalid");
        return;
      }

      onSubmit?.(data, selectedStudents, selectedTeachers);
    };

    const cancelCreateClassRoom = () => {
      resetStore(); // Reset all selected value in classRoom store
      reset(); //Reset Form
    };

    useImperativeHandle(ref, () => ({
      resetForm: () => {
        resetStore(); // Reset all selected value in classRoom store
        reset(); //Reset Form
      },
    }));
    /**
     * Init form value
     */
    useEffect(() => {
      if (!initFormValue) return;
      Object.entries(initFormValue).forEach(([key, value]) => {
        setValue(key as keyof ClassRoom, value);
      });
    }, [initFormValue]);

    return (
      <FormProvider {...methods}>
        {!watchRoomType ? (
          <div className="max-w-[1040px] mx-auto">
            <ClassRoomTypeSelector onSelect={handleSelectRoomType} platform={platform} />
            <div className="h-6"></div>
          </div>
        ) : (
          <ClassRoomTabContainer
            ref={classRoomTabContainerRef}
            previewUI={<ClassRoomPreview control={control} />}
            trigger={trigger}
            errors={errors}
            items={[
              {
                tabName: "Thông tin chung",
                tabKey: TAB_KEYS_CLASS_ROOM["clsTab-information"],
                icon: <GlobeIcon className="w-5 h-5" />,
                content: <TabClassRoomInformation />,
              },
              {
                tabName: "Thời gian",
                tabKey: TAB_KEYS_CLASS_ROOM["clsTab-session"],
                icon: <CalendarDateIcon className="w-5 h-5" />,
                content: <TabClassRoomSession />,
              },
              {
                tabName: "Tài nguyên",
                tabKey: TAB_KEYS_CLASS_ROOM["clsTab-resource"],
                icon: <ClipboardIcon className="w-5 h-5" />,
                content: <TabClassRoomResource />,
              },
              {
                tabName: "Thiết lập",
                tabKey: TAB_KEYS_CLASS_ROOM["clsTab-setting"],
                icon: <UsersPlusIcon className="w-5 h-5" />,
                content: <TabClassRoomSetting />,
              },
            ]}
            actions={
              <div className="flex items-center gap-2">
                <IconButton
                  className="border rounded-lg border-gray-300 bg-white"
                  onClick={cancelCreateClassRoom}
                  disabled={isLoading}
                >
                  <CloseIcon />
                </IconButton>
                <IconButton className="border rounded-lg border-gray-300 bg-white" disabled={isLoading}>
                  <EyeIcon />
                </IconButton>
                <Button
                  size="large"
                  color="inherit"
                  variant="outlined"
                  className="border-gray-300"
                  disabled={isLoading}
                  onClick={triggerBeforeSubmitForm(handleSubmit(submitForm), "draft")}
                >
                  Lưu nháp
                </Button>
                <Button
                  size="large"
                  onClick={triggerBeforeSubmitForm(handleSubmit(submitForm), "publish")}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {action === "create" ? "Đăng tải" : "Cập nhật"}
                </Button>
              </div>
            }
          />
        )}
      </FormProvider>
    );
  },
);
export default ClassRoomFormContainer;

export const useClassRoomFormContext = useFormContext<ClassRoom>;
