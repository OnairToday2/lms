"use client";
import PageContainer from "@/shared/ui/PageContainer";
import { Button } from "@mui/material";
import FormManageClassRoom from "@/modules/class-room-management/components/ManageClassRoomForm";
const CreateClassRoomPage = () => {
  const handleCreateClassRoom = () => {};

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
        <FormManageClassRoom />
      </div>
    </PageContainer>
  );
};
export default CreateClassRoomPage;
