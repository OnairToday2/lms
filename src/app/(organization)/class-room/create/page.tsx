"use client";
import PageContainer from "@/shared/ui/PageContainer";
import FormManageClassRoom, {
  FormManageClassRoomProps,
  FormManageClassRoomRef,
} from "@/modules/class-room-management/components/ManageClassRoomForm";
import { useCRUDClassRoom } from "@/modules/class-room-management/hooks/useCRUDClassRoom";
import { useRef } from "react";
import { useToast } from "@/shared/store/toast-snackbar/toast-snackbar-context";
import { Button } from "@mui/material";

const CreateClassRoomPage = () => {
  const showMessage = useToast((state) => state.showSnackbar);
  const formClassRoomRef = useRef<FormManageClassRoomRef>(null);
  const { onCreate, isLoading } = useCRUDClassRoom();
  const handleCreateClassRoom: FormManageClassRoomProps["onSubmit"] = (formData, students, teachers) => {
    onCreate(
      { formData, employees: students, teachers: teachers },
      {
        onSuccess(data, variables, onMutateResult, context) {
          showMessage("Tạo lớp học thành công.", "success");
          formClassRoomRef.current?.resetForm();
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
        <FormManageClassRoom onSubmit={handleCreateClassRoom} ref={formClassRoomRef} />
      </div>
    </PageContainer>
  );
};
export default CreateClassRoomPage;
