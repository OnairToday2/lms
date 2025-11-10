import { redirect } from "next/navigation";
import PageContainer from "@/shared/ui/PageContainer";
import CreateClassRoomForm from "./_components/CreateClassRoomForm";
import { ClassRoomPlatformType } from "@/constants/class-room.constant";
import { ClassRoomType } from "@/model/class-room.model";
import { PATHS } from "@/constants/path.contstants";
interface CreateClassRoomPageProps {
  searchParams: Promise<
    {
      platform: ClassRoomPlatformType;
      roomtype: ClassRoomType;
    } & Record<string, any>
  >;
}
const CreateClassRoomPage: React.FC<CreateClassRoomPageProps> = async ({ searchParams }) => {
  const { platform, roomtype } = await searchParams;

  if (
    (roomtype !== "multiple" && roomtype !== "single") ||
    (platform !== "hybrid" && platform !== "offline" && platform !== "online")
  ) {
    redirect("/admin/class-room");
  }

  return (
    <PageContainer
      title={`Tạo lớp học ${platform === "online" ? "trực tuyến" : "trực tiếp"}`}
      breadcrumbs={[
        {
          title: "Quản lý lớp học",
          path: PATHS.CLASSROOMS.ROOT,
        },
        {
          title: "Tạo lớp học trực tuyến",
        },
      ]}
    >
      <div className="max-w-[1200px]">
        <CreateClassRoomForm platform={platform} roomType={roomtype} />
      </div>
    </PageContainer>
  );
};
export default CreateClassRoomPage;
