import { notFound } from "next/navigation";
import PageContainer from "@/shared/ui/PageContainer";
import StudentsSection from "./_components";
import { getClassRoomById } from "@/repository/class-room";

const StudentsPage = async ({ params }: { params: Promise<{ classRoomId: string }> }) => {
    const { classRoomId } = await params;
    const { data: classRoom, error } = await getClassRoomById(classRoomId);


    if (!classRoom || error) {
        return notFound();
    }

    const classRoomTitle = classRoom?.title || "Lớp học";
    const pageTitle = `Danh Sách học viên${classRoom?.title ? ` • ${classRoomTitle}` : ""}`;

    return (
        <PageContainer
            title={pageTitle}
            breadcrumbs={[
                {
                    title: "LMS",
                    path: "/dashboard",
                },
                {
                    title: classRoomTitle,
                },
                {
                    title: "Danh Sách học viên",
                },
            ]}
        >
            <StudentsSection classRoomId={classRoomId} />
        </PageContainer>
    );
};

export default StudentsPage;
