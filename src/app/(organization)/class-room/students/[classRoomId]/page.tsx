import PageContainer from "@/shared/ui/PageContainer";
import StudentsSection from "./_components";


const StudentsPage = async ({ params }: { params: Promise<{ classRoomId: string }> }) => {
    const { classRoomId } = await params;
    return (
        <PageContainer
            title="Danh Sách học viên"
            breadcrumbs={[
                {
                    title: "LMS",
                    path: "/dashboard",
                },
                {
                    title: "Khoá học cơ bản về AI dành cho Doanh nghiệp trong thời kỳ...",
                },
            ]}
        >
            <StudentsSection classRoomId={classRoomId} />
        </PageContainer>
    );
}

export default StudentsPage;
