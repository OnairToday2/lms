import PageContainer from "@/shared/ui/PageContainer";
import CreateClassRoomForm from "./_components/CreateClassRoomForm";
import { ClassRoomPlatformType } from "@/constants/class-room.constant";
interface CreateClassRoomPageProps {
  params: Promise<{
    platform: ClassRoomPlatformType;
  }>;
}
const CreateClassRoomPage: React.FC<CreateClassRoomPageProps> = async ({ params }) => {
  const { platform } = await params;
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
        <CreateClassRoomForm platform={platform} />
      </div>
    </PageContainer>
  );
};
export default CreateClassRoomPage;
