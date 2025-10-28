"use client";
import ManageAssignmentForm, {
  ManageAssignmentFormProps,
  ManageAssignmentFormRef,
} from "@/modules/assignment-management/components/ManageAssignmentForm";
import { useCRUDAssignment } from "@/modules/assignment-management/hooks/useCRUDAssignment";
import { useRef } from "react";
import { useSnackbar } from "notistack";

interface UpdateAssignmentProps {
  assignmentId: string;
}

const UpdateAssignment: React.FC<UpdateAssignmentProps> = ({ assignmentId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const formAssignmentRef = useRef<ManageAssignmentFormRef>(null);
  const { onUpdate, isLoading } = useCRUDAssignment();

  const mockAssignmentData = {
    name: "Bài kiểm tra mẫu",
    description: "<p>Đây là mô tả bài kiểm tra mẫu</p>",
  };

  const handleUpdateAssignment: ManageAssignmentFormProps["onSubmit"] = (formData) => {
    onUpdate(
      { formData },
      {
        onSuccess(data, variables, context) {
          enqueueSnackbar("Cập nhật bài kiểm tra thành công", { variant: "success" });
        },
      },
    );
  };

  return (
    <ManageAssignmentForm
      onSubmit={handleUpdateAssignment}
      ref={formAssignmentRef}
      isLoading={isLoading}
      action="edit"
      value={mockAssignmentData}
    />
  );
};

export default UpdateAssignment;

