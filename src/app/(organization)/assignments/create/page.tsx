import PageContainer from "@/shared/ui/PageContainer";

export default function CreateAssignmentPage() {
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
      <div>Create page</div>
    </PageContainer>
  );
}

