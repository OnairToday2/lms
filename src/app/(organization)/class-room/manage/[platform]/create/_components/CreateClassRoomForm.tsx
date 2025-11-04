"use client";
import { ClassRoomPlatformType } from "@/constants/class-room.constant";
import ManageClassRoomForm, {
  ManageClassRoomFormProps,
  ManageClassRoomFormRef,
} from "@/modules/class-room-management/components/ManageClassRoomForm";
import { useCRUDClassRoom } from "@/modules/class-room-management/hooks/useCRUDClassRoom";
import { useSnackbar } from "notistack";
import { useRef } from "react";
interface CreateClassRoomFormProps {
  platform: ClassRoomPlatformType;
}
const CreateClassRoomForm: React.FC<CreateClassRoomFormProps> = ({ platform }) => {
  const { enqueueSnackbar } = useSnackbar();
  const formClassRoomRef = useRef<ManageClassRoomFormRef>(null);
  const { onCreate, isLoading } = useCRUDClassRoom();

  const handleCreateClassRoom: ManageClassRoomFormProps["onSubmit"] = (formData, students, teachers) => {
    onCreate(
      { formData, students, teachers },
      {
        onSuccess(data, variables, onMutateResult, context) {
          enqueueSnackbar("Tạo lớp học thành công", { variant: "success" });
          formClassRoomRef.current?.resetForm();
        },
      },
    );
  };
  return (
    <ManageClassRoomForm
      onSubmit={handleCreateClassRoom}
      platform={platform}
      ref={formClassRoomRef}
      isLoading={isLoading}
    />
  );
};
export default CreateClassRoomForm;
