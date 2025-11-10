import React from "react";
import PageContainer from "@/shared/ui/PageContainer";
import AssignmentGrading from "./_components/AssignmentGrading";

interface PageProps {
  params: Promise<{
    id: string;
    employeeId: string;
  }>;
}

export default async function GradeAssignmentPage({ params }: PageProps) {
  const { id, employeeId } = await params;

  return (
    <PageContainer
      title="Chấm điểm"
      breadcrumbs={[
        { title: "Trang chủ", path: "/" },
        { title: "Bài kiểm tra", path: "/assignments" },
        { title: "Chấm điểm" },
      ]}
    >
      <AssignmentGrading assignmentId={id} employeeId={employeeId} />
    </PageContainer>
  );
}
