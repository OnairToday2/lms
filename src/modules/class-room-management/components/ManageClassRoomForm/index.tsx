"use client";
import { ClassRoomProvider } from "../../store/class-room-context";
import ClassRoomFormContainer, {
  ClassRoomFormContainerProps,
  ClassRoomFormContainerRef,
} from "./ClassRoomFormContainer";
import { forwardRef, memo } from "react";

export interface ManageClassRoomFormRef extends ClassRoomFormContainerRef {}
export interface ManageClassRoomFormProps {
  onSubmit?: ClassRoomFormContainerProps["onSubmit"];
  isLoading?: boolean;
  action?: "create" | "edit";
  value?: ClassRoomFormContainerProps["value"];
}
const ManageClassRoomForm = forwardRef<ManageClassRoomFormRef, ManageClassRoomFormProps>(
  ({ onSubmit, value, action = "create", isLoading = false }, ref) => {
    return (
      <ClassRoomProvider>
        <ClassRoomFormContainer onSubmit={onSubmit} ref={ref} isLoading={isLoading} action={action} value={value} />
      </ClassRoomProvider>
    );
  },
);
export default memo(ManageClassRoomForm);
