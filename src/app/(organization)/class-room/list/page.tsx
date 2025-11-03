import PageContainer from "@/shared/ui/PageContainer";
import ClassRoomContainer from "./_components/ClassRoomContainer";


const ClassRoomList = () => {
  return (
    <PageContainer
      title="Quản lý lớp học trực tuyến (Live) "
      breadcrumbs={[
        {
          title: "LMS",
          path: "/dashboard",
        },
        {
          title: "Quản lý lớp học trực tuyến (live)",
        },
      ]}
    >
      <ClassRoomContainer />
    </PageContainer>
  )
};

export default ClassRoomList;
