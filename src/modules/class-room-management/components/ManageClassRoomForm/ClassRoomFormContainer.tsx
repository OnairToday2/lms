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
import ClassRoomTabContainer, { ClassRoomTabContainerRef } from "./ClassRoomTabContainer";
import { CalendarDateIcon, ClipboardIcon, CloseIcon, EyeIcon, InforCircleIcon } from "@/shared/assets/icons";
import { UsersIcon2 } from "@/shared/assets/icons";
import ClassRoomPreview from "./ClassRoomPreview";
import ClassRoomTypeSelector, { ClassRoomTypeSelectorProps } from "./ClassRoomTypeSelector";
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
  value?: ClassRoom;
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
    platform: undefined,
    classRoomSessions: [],
  };
};

const ClassRoomFormContainer = React.forwardRef<ClassRoomFormContainerRef, ClassRoomFormContainerProps>(
  ({ onSubmit, isLoading, action, value: initFormValue }, ref) => {
    const classRoomTabContainerRef = React.useRef<ClassRoomTabContainerRef>(null);
    const resetStore = useClassRoomStore(({ actions }) => actions.reset);
    const selectedStudents = useClassRoomStore(({ state }) => state.selectedStudents);
    const selectedTeachers = useClassRoomStore(({ state }) => state.selectedTeachers);

    const methods = useForm<ClassRoom>({
      resolver: zodResolver(classRoomSchema),
      defaultValues: initFormValue ?? initClassRoomFormData(),
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

    const handleSelectRoomType: ClassRoomTypeSelectorProps["onSelect"] = React.useCallback((type, platform) => {
      setValue("roomType", type);
      setValue("platform", platform);
    }, []);

    const triggerBeforeSubmitForm = (submitAction: Function, status: "draft" | "publish") => async () => {
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
      resetStore(); // Reset all selected value in classRoom store
      reset(); //Reset Form
    };

    React.useImperativeHandle(ref, () => ({
      resetForm: () => {
        resetStore(); // Reset all selected value in classRoom store
        reset(); //Reset Form
      },
    }));

    /**
     * Init form value
     */
    React.useEffect(() => {
      if (!initFormValue) return;
      Object.entries(initFormValue).forEach(([key, value]) => {
        setValue(key as keyof ClassRoom, value);
      });
    }, [initFormValue]);

    return (
      <FormProvider {...methods}>
        {!watchRoomType ? (
          <div className="max-w-[1040px] mx-auto">
            <ClassRoomTypeSelector onSelect={handleSelectRoomType} />
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
                icon: <InforCircleIcon />,
                content: <TabClassRoomInformation />,
              },
              {
                tabName: "Thời gian",
                tabKey: TAB_KEYS_CLASS_ROOM["clsTab-session"],
                icon: <CalendarDateIcon />,
                content: <TabClassRoomSession />,
              },
              {
                tabName: "Tài nguyên",
                tabKey: TAB_KEYS_CLASS_ROOM["clsTab-resource"],
                icon: <ClipboardIcon />,
                content: <TabClassRoomResource />,
              },
              {
                tabName: "Thiết lập",
                tabKey: TAB_KEYS_CLASS_ROOM["clsTab-setting"],
                icon: <UsersIcon2 />,
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
