"use client";

import { ClassRoomProvider } from "../../store/class-room-context";
import { ClassRoomStore } from "../../store/class-room-store";
import ClassRoomFormContainer, {
  ClassRoomFormContainerProps,
  ClassRoomFormContainerRef,
} from "./ClassRoomFormContainer";
import { forwardRef, memo } from "react";

export type ManageClassRoomFormRef = ClassRoomFormContainerRef;
export interface ManageClassRoomFormProps {
  onSubmit?: ClassRoomFormContainerProps["onSubmit"];
  platform: ClassRoomFormContainerProps["platform"];
  isLoading?: boolean;
  action?: "create" | "edit";
  initFormValue?: ClassRoomFormContainerProps["value"];
  students?: ClassRoomStore["state"]["selectedStudents"]; // init students
  teachers?: ClassRoomStore["state"]["selectedTeachers"]; // init teachers
}
const ManageClassRoomForm = forwardRef<ManageClassRoomFormRef, ManageClassRoomFormProps>(
  ({ onSubmit, initFormValue, action = "create", isLoading = false, teachers, students, platform }, ref) => {
    return (
      <ClassRoomProvider selectedStudents={students} selectedTeachers={teachers}>
        <ClassRoomFormContainer
          ref={ref}
          onSubmit={onSubmit}
          isLoading={isLoading}
          action={action}
          value={initFormValue}
          platform={platform}
        />
      </ClassRoomProvider>
    );
  },
);
export default memo(ManageClassRoomForm);
