"use client";
import React, { useEffect, useRef, useImperativeHandle, useCallback, forwardRef, useLayoutEffect } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { upsertCourseSchema, UpsertCourseFormData } from "../upsert-course.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, IconButton } from "@mui/material";
import { CalendarDateIcon, CloseIcon, EyeIcon, GlobeIcon, UsersPlusIcon } from "@/shared/assets/icons";
import { useUpsertCourseStore } from "../../store/upsert-course-context";
import UpsertCourseTabContainer, { UpsertCourseTabContainerRef } from "./UpsertCourseTabContainer";
import TabClassRoomInformation from "./TabClassRoomInformation";
import TabClassRoomSession, { initClassSessionFormData } from "./TabClassRoomSession";
import TabClassRoomSetting from "./TabClassRoomSetting";
import { ClassRoomPlatformType } from "@/constants/class-room.constant";
import { ClassRoomType } from "@/model/class-room.model";
import { useSnackbar } from "notistack";
import { getKeyFieldByTab } from "./utils";
import { UpsertCourseStore } from "../../store/upsert-course-store";

export const TAB_KEYS_CLASS_ROOM = {
  "clsTab-information": "clsTab-information",
  "clsTab-session": "clsTab-session",
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
      next: TAB_KEYS_CLASS_ROOM["clsTab-setting"],
    },
  ],
  [
    TAB_KEYS_CLASS_ROOM["clsTab-setting"],
    {
      prev: TAB_KEYS_CLASS_ROOM["clsTab-session"],
      next: null,
    },
  ],
]);

export interface UpsertCourseFormContainerRef {
  resetForm: () => void;
}
export interface UpsertCourseFormContainerProps {
  onSubmit?: (
    formData: UpsertCourseFormData,
    selectedStudents: UpsertCourseStore["state"]["selectedStudents"],
    selectedTeachers: UpsertCourseStore["state"]["selectedTeachers"],
  ) => void;
  onCancel?: () => void;
  value?: UpsertCourseFormData;
  isLoading?: boolean;
  action?: "create" | "edit";
}

export const initClassRoomFormData = (oprions: {
  platform?: ClassRoomPlatformType;
  roomType?: ClassRoomType;
}): Partial<UpsertCourseFormData> => {
  return {
    title: "",
    description: "",
    thumbnailUrl: "",
    categories: [],
    classRoomId: "",
    slug: "",
    status: "draft",
    roomType: oprions?.roomType || "single",
    forWhom: [],
    docs: [],
    classRoomSessions: [],
  };
};

const UpsertCourseFormContainer = forwardRef<UpsertCourseFormContainerRef, UpsertCourseFormContainerProps>(
  ({ onSubmit, isLoading, action, value: initFormValue, onCancel }, ref) => {
    const { enqueueSnackbar } = useSnackbar();
    const classRoomTabContainerRef = useRef<UpsertCourseTabContainerRef>(null);
    const resetStore = useUpsertCourseStore(({ actions }) => actions.reset);
    const selectedStudents = useUpsertCourseStore(({ state }) => state.selectedStudents);
    const selectedTeachers = useUpsertCourseStore(({ state }) => state.selectedTeachers);

    const methods = useForm<UpsertCourseFormData>({
      resolver: zodResolver(upsertCourseSchema),
      // defaultValues: initClassRoomFormData({
      //   platform: platform,
      //   roomType: roomType,
      // }),
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

    const triggerBeforeSubmitForm = (submitAction: () => void, status: "draft" | "publish") => async () => {
      try {
        const TAB_LIST = [
          TAB_KEYS_CLASS_ROOM["clsTab-information"],
          TAB_KEYS_CLASS_ROOM["clsTab-session"],
          TAB_KEYS_CLASS_ROOM["clsTab-setting"],
        ];
        const allTabsTriggers = await Promise.allSettled(
          TAB_LIST.map(async (key) => {
            const isValid = await trigger(getKeyFieldByTab(key));
            classRoomTabContainerRef.current?.setTabStatus(key, isValid ? "valid" : "invalid");
            return isValid;
          }),
        );
        const isSomeTabFailed = allTabsTriggers.some((tab) => tab.status === "rejected" || !tab.value);

        if (isSomeTabFailed) return;

        setValue("status", status);

        submitAction();
      } catch (error) {
        console.log(error);
      }
    };

    const submitForm: SubmitHandler<UpsertCourseFormData> = (data) => {
      console.log({ errors, data, selectedTeachers, selectedStudents });

      const sessionList = getValues("classRoomSessions");

      const isEverySessionHasTeacher = sessionList.every((session, _index) => {
        const hasTeacher = !!selectedTeachers[_index]?.length;
        if (!hasTeacher) {
          enqueueSnackbar(`"${session.title}" chưa chọn giáo viên.`, { variant: "error" });
          classRoomTabContainerRef.current?.setTabStatus("clsTab-session", "invalid");
        }
        return hasTeacher;
      });

      if (!isEverySessionHasTeacher) {
        return;
      }

      // if (!selectedStudents.length) {
      //   enqueueSnackbar(`Chưa chọn học viên.`, { variant: "error" });
      //   classRoomTabContainerRef.current?.setTabStatus("clsTab-setting", "invalid");
      //   return;
      // }

      onSubmit?.(data, selectedStudents, selectedTeachers);
    };

    const cancelCreateClassRoom = () => {
      resetStore(); // Reset all selected value in classRoom store
      reset(); //Reset Form
      onCancel?.();
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
    useLayoutEffect(() => {
      if (!initFormValue) return;
      reset(initFormValue);
    }, [initFormValue]);

    return (
      <FormProvider {...methods}>
        <UpsertCourseTabContainer
          ref={classRoomTabContainerRef}
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
            // {
            //   tabName: "Tài nguyên",
            //   tabKey: TAB_KEYS_CLASS_ROOM["clsTab-resource"],
            //   icon: <ClipboardIcon className="w-5 h-5" />,
            //   content: <TabClassRoomResource />,
            // },
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
              {/* <IconButton className="border rounded-lg border-gray-300 bg-white" disabled={isLoading}>
                <EyeIcon />
              </IconButton> */}
              {/* <Button
                size="large"
                color="inherit"
                variant="outlined"
                className="border-gray-300"
                disabled={isLoading}
                onClick={triggerBeforeSubmitForm(handleSubmit(submitForm), "draft")}
              >
                Lưu nháp
              </Button> */}
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
      </FormProvider>
    );
  },
);
export default UpsertCourseFormContainer;

export const useUpsertCourseFormContext = useFormContext<UpsertCourseFormData>;
