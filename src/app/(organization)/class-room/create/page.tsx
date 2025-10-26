"use client";
import PageContainer from "@/shared/ui/PageContainer";
import FormManageClassRoom, {
  ManageClassRoomFormProps,
  ManageClassRoomFormRef,
} from "@/modules/class-room-management/components/ManageClassRoomForm";
import { useCRUDClassRoom } from "@/modules/class-room-management/hooks/useCRUDClassRoom";
import { useRef } from "react";
import { useSnackbar } from "notistack";
const CreateClassRoomPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const formClassRoomRef = useRef<ManageClassRoomFormRef>(null);
  const { onCreate, isLoading } = useCRUDClassRoom();

  const handleCreateClassRoom: ManageClassRoomFormProps["onSubmit"] = (formData, students, teachers) => {
    onCreate(
      { formData, students, teachers },
      {
        onSuccess(data, variables, onMutateResult, context) {
          enqueueSnackbar("Tạo lớp học thành công", { variant: "success" });
          // formClassRoomRef.current?.resetForm();
        },
      },
    );
  };

  return (
    <PageContainer
      title="Tạo lớp học"
      breadcrumbs={[
        {
          title: "LMS",
          path: "/dashboard",
        },
        {
          title: "Tạo lớp học trực tuyến",
        },
      ]}
    >
      <div className="max-w-[1200px]">
        <FormManageClassRoom onSubmit={handleCreateClassRoom} ref={formClassRoomRef} isLoading={isLoading} />
      </div>
    </PageContainer>
  );
};
export default CreateClassRoomPage;
