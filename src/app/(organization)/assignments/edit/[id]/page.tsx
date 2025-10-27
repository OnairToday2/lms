import PageContainer from "@/shared/ui/PageContainer";

interface EditAssignmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAssignmentPage({ params }: EditAssignmentPageProps) {
  const { id } = await params;

  return (
    <PageContainer
      title="Chỉnh sửa bài kiểm tra"
      breadcrumbs={[
        {
          title: "LMS",
          path: "/dashboard",
        },
        {
          title: "Chỉnh sửa bài kiểm tra",
        },
      ]}
    >
      <div>Edit page</div>
    </PageContainer>
  );
}

