"use client";

import { UpsertCourseProvider } from "../../store/upsert-course-context";
import { UpsertCourseStore } from "../../store/upsert-course-store";
import UpsertCourseFormContainer, {
  UpsertCourseFormContainerProps,
  UpsertCourseFormContainerRef,
} from "./UpsertCourseFormContainer";
import { forwardRef, memo } from "react";

export type ManageClassRoomFormRef = UpsertCourseFormContainerRef;
export interface ManageClassRoomFormProps {
  onSubmit?: UpsertCourseFormContainerProps["onSubmit"];
  onCancel?: UpsertCourseFormContainerProps["onCancel"];
  isLoading?: boolean;
  action?: "create" | "edit";
  initFormValue?: UpsertCourseFormContainerProps["value"];
  students?: UpsertCourseStore["state"]["selectedStudents"]; // init students
  teachers?: UpsertCourseStore["state"]["selectedTeachers"]; // init teachers
}
const ManageClassRoomForm = forwardRef<ManageClassRoomFormRef, ManageClassRoomFormProps>(
  ({ onSubmit, initFormValue, action = "create", isLoading = false, teachers, students, onCancel }, ref) => {
    return (
      <UpsertCourseProvider selectedStudents={students} selectedTeachers={teachers}>
        <UpsertCourseFormContainer
          ref={ref}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
          action={action}
          value={initFormValue}
        />
      </UpsertCourseProvider>
    );
  },
);
export default memo(ManageClassRoomForm);
