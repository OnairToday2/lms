import PageContainer from "@/shared/ui/PageContainer";
import UpdateClassRoom from "./_components/UpdateClassRoom";
import { getClassRoomById } from "@/repository/class-room";
import { notFound } from "next/navigation";

interface EditClassRoomPageProps {
  params: Promise<{
    id: string;
  }>;
}
export type GetClassRoomByIdData = Awaited<ReturnType<typeof getClassRoomById>>["data"];
const EditClassRoomPage = async ({ params }: EditClassRoomPageProps) => {
  const { id: classRoomId } = await params;
  const { data, error } = await getClassRoomById(classRoomId);

  console.log(data, error);

  if (!data || error) {
    return notFound();
  }

  return (
    <PageContainer
      title={data.title || "Cập nhật lớp học"}
      breadcrumbs={[
        {
          title: "LMS",
          path: "/dashboard",
        },
        {
          title: "Cập nhật",
          path: "/dashboard",
        },
        {
          title: data?.title || "Cập nhật lớp học",
        },
      ]}
    >
      <div className="max-w-[1200px]">
        <UpdateClassRoom data={data} />
      </div>
    </PageContainer>
  );
};
export default EditClassRoomPage;
