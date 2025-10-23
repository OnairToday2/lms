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
  value?: any;
}
const FormManageClassRoom = forwardRef<FormManageClassRoomRef, FormManageClassRoomProps>(({ onSubmit, value }, ref) => {
  return (
    <ClassRoomProvider>
      <ClassRoomFormContainer onSubmit={onSubmit} ref={ref} />
    </ClassRoomProvider>
  );
});
export default memo(FormManageClassRoom);
