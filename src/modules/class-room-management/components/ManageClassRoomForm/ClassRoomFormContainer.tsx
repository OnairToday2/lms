"use client";
import * as React from "react";

import TabClassRoomInformation from "./TabClassRoomInformation";
import TabClassRoomResource from "./TabClassRoomResource";
import TabClassRoomSession from "./TabClassRoomSession";
import TabClassRoomSetting from "./TabClassRoomSetting";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { classRoomSchema, ClassRoom } from "../classroom-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, IconButton } from "@mui/material";
import ClassRoomTabContainer from "./ClassRoomTabContainer";
import { getKeyFieldByTab, getStatusTabClassRoom } from "./utils";
import { CalendarDateIcon, ClipboardIcon, CloseIcon, EyeIcon, InforCircleIcon } from "@/shared/assets/icons";
import { UsersIcon2 } from "@/shared/assets/icons";
import ClassRoomPreview from "./ClassRoomPreview";
import ClassRoomTypeSelector, { ClassRoomTypeSelectorProps } from "./ClassRoomTypeSelector";
import { initClassSessionFormData } from "./TabClassRoomSession/MultipleSession";
import { useClassRoomStore } from "../../store/class-room-context";
import { ClassRoomStore } from "../../store/class-room-store";

export const TAB_KEYS_CLASS_ROOM = {
  "clsTab-information": "clsTab-information",
  "clsTab-session": "clsTab-session",
  "clsTab-resource": "clsTab-resource",
  "clsTab-setting": "clsTab-setting",
} as const;

export interface ClassRoomFormContainerRef {
  resetForm: () => void;
}
export interface ClassRoomFormContainerProps {
  onSubmit?: (
    formData: ClassRoom,
    selectedStudents: ClassRoomStore["state"]["selectedStudents"],
    selectedTeachers: ClassRoomStore["state"]["selectedTeachers"],
  ) => void;
  value?: {
    formData: ClassRoom;
    selectedStudents: ClassRoomStore["state"]["selectedStudents"];
    selectedTeachers: ClassRoomStore["state"]["selectedTeachers"];
  };
  isLoading?: boolean;
  action?: "create" | "edit";
}

export const initClassRoomFormData = (): Partial<ClassRoom> => {
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
    classRoomSessions: [initClassSessionFormData()],
  };
};

const ClassRoomFormContainer = React.forwardRef<ClassRoomFormContainerRef, ClassRoomFormContainerProps>(
  ({ onSubmit, isLoading, action, value }, ref) => {
    const formSubmitStateRef = React.useRef<boolean>(false);
    const resetStore = useClassRoomStore(({ actions }) => actions.reset);
    const selectedStudents = useClassRoomStore(({ state }) => state.selectedStudents);
    const selectedTeachers = useClassRoomStore(({ state }) => state.selectedTeachers);

    const methods = useForm<ClassRoom>({
      resolver: zodResolver(classRoomSchema),
      defaultValues: value?.formData ?? initClassRoomFormData(),
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

    const handleSelectRoomType: ClassRoomTypeSelectorProps["onSelect"] = React.useCallback((type) => {
      setValue("roomType", type);
    }, []);

    const handleTriggerFieldsByTab = async (takKey: keyof typeof TAB_KEYS_CLASS_ROOM) => {
      const keysTriggerByTab = getKeyFieldByTab(takKey);
      const triggersInformationKeys = keysTriggerByTab.map((key) => trigger(key));
      return (await Promise.all(triggersInformationKeys)).every(Boolean);
    };

    const triggerForm = (submitAction: Function) => async () => {
      formSubmitStateRef.current = true;
      try {
        const isValidAllClassRoomForm = await trigger();
        if (isValidAllClassRoomForm) {
          submitAction();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const submitForm: SubmitHandler<ClassRoom> = (data) => {
      console.log({ errors, data, selectedTeachers, selectedStudents });

      if (!selectedStudents.length) {
        console.error("Students is Empty ");
        return;
      }

      const sessionList = getValues("classRoomSessions");
      const isEverySessionHasTeacher = sessionList.every((session, _index) => {
        return Boolean(selectedTeachers[_index]?.length);
      });

      if (!isEverySessionHasTeacher) {
        console.error("Some class session is Empty teacher");
        return;
      }

      onSubmit?.(data, selectedStudents, selectedTeachers);
    };

    const cancelCreateClassRoom = () => {
      formSubmitStateRef.current = false; //Reset state form submit
      resetStore(); // Reset all selected value in store
      reset(); //Reset Form
    };

    React.useImperativeHandle(ref, () => ({
      resetForm: () => {
        formSubmitStateRef.current = false; //Reset state form submit
        resetStore(); // Reset all selected value in store
        reset(); //Reset Form
      },
    }));
    return (
      <FormProvider {...methods}>
        {!watchRoomType ? (
          <div className="max-w-[1040px] mx-auto">
            <ClassRoomTypeSelector onSelect={handleSelectRoomType} />
            <div className="h-6"></div>
          </div>
        ) : (
          <ClassRoomTabContainer
            previewUI={<ClassRoomPreview control={control} />}
            checkStatusTab={handleTriggerFieldsByTab}
            items={[
              {
                tabName: "Thông tin chung",
                tabKey: TAB_KEYS_CLASS_ROOM["clsTab-information"],
                icon: <InforCircleIcon />,
                content: <TabClassRoomInformation />,
                status: formSubmitStateRef.current
                  ? getStatusTabClassRoom(errors, TAB_KEYS_CLASS_ROOM["clsTab-information"])
                  : "idle",
              },
              {
                tabName: "Thời gian",
                tabKey: TAB_KEYS_CLASS_ROOM["clsTab-session"],
                icon: <CalendarDateIcon />,
                content: <TabClassRoomSession />,
                status: formSubmitStateRef.current
                  ? getStatusTabClassRoom(errors, TAB_KEYS_CLASS_ROOM["clsTab-session"])
                  : "idle",
              },
              {
                tabName: "Tài nguyên",
                tabKey: TAB_KEYS_CLASS_ROOM["clsTab-resource"],
                icon: <ClipboardIcon />,
                content: <TabClassRoomResource />,
                status: formSubmitStateRef.current
                  ? getStatusTabClassRoom(errors, TAB_KEYS_CLASS_ROOM["clsTab-resource"])
                  : "idle",
              },
              {
                tabName: "Thiết lập",
                tabKey: TAB_KEYS_CLASS_ROOM["clsTab-setting"],
                icon: <UsersIcon2 />,
                content: <TabClassRoomSetting />,
                status: formSubmitStateRef.current
                  ? getStatusTabClassRoom(errors, TAB_KEYS_CLASS_ROOM["clsTab-setting"])
                  : "idle",
              },
            ]}
            actions={
              <div className="flex items-center gap-2">
                <IconButton
                  className="border rounded-lg border-gray-400 bg-white"
                  onClick={cancelCreateClassRoom}
                  disabled={isLoading}
                >
                  <CloseIcon />
                </IconButton>
                <IconButton className="border rounded-lg border-gray-400 bg-white" disabled={isLoading}>
                  <EyeIcon />
                </IconButton>
                <Button
                  size="large"
                  color="inherit"
                  variant="outlined"
                  className="border-gray-400"
                  disabled={isLoading}
                  onClick={triggerForm(handleSubmit(submitForm))}
                >
                  Lưu nháp
                </Button>
                <Button
                  size="large"
                  onClick={triggerForm(handleSubmit(submitForm))}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Đăng tải
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
