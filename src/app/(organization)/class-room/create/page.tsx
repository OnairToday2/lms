import PageContainer from "@/shared/ui/PageContainer";
import CreateClassRoomForm from "./_components/CreateClassRoomForm";
const CreateClassRoomPage = () => {
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
        <CreateClassRoomForm />
      </div>
    </PageContainer>
  );
};
export default CreateClassRoomPage;
