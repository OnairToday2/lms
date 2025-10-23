"use client";
import { ClassRoomProvider } from "../../store/class-room-context";
import ClassRoomFormContainer, {
  ClassRoomFormContainerProps,
  ClassRoomFormContainerRef,
} from "./ClassRoomFormContainer";
import { forwardRef, memo } from "react";

export interface FormManageClassRoomRef extends ClassRoomFormContainerRef {}
export interface FormManageClassRoomProps {
  onSubmit?: ClassRoomFormContainerProps["onSubmit"];
  isLoading?: boolean;
  action?: "create" | "edit";
  value?: any;
}
const FormManageClassRoom = forwardRef<FormManageClassRoomRef, FormManageClassRoomProps>(
  ({ onSubmit, value, action = "create", isLoading = false }, ref) => {
    return (
      <ClassRoomProvider>
        <ClassRoomFormContainer onSubmit={onSubmit} ref={ref} isLoading={isLoading} action={action} value={value} />
      </ClassRoomProvider>
    );
  },
);
export default memo(FormManageClassRoom);
