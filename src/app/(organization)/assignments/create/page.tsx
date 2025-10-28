"use client";
import PageContainer from "@/shared/ui/PageContainer";
import ManageAssignmentForm, {
  ManageAssignmentFormProps,
  ManageAssignmentFormRef,
} from "@/modules/assignment-management/components/ManageAssignmentForm";
import { useCRUDAssignment } from "@/modules/assignment-management/hooks/useCRUDAssignment";
import { useRef } from "react";
import { useSnackbar } from "notistack";

export default function CreateAssignmentPage() {
  const { enqueueSnackbar } = useSnackbar();
  const formAssignmentRef = useRef<ManageAssignmentFormRef>(null);
  const { onCreate, isLoading } = useCRUDAssignment();

  const handleCreateAssignment: ManageAssignmentFormProps["onSubmit"] = (formData) => {
    onCreate(
      { formData },
      {
        onSuccess(data, variables, context) {
          enqueueSnackbar("Tạo bài kiểm tra thành công", { variant: "success" });
        },
      },
    );
  };

  return (
    <PageContainer
      title="Tạo bài kiểm tra"
      breadcrumbs={[
        {
          title: "LMS",
          path: "/dashboard",
        },
        {
          title: "Tạo bài kiểm tra",
        },
      ]}
    >
      <div className="max-w-[1200px]">
        <ManageAssignmentForm onSubmit={handleCreateAssignment} ref={formAssignmentRef} isLoading={isLoading} />
      </div>
    </PageContainer>
  );
}

