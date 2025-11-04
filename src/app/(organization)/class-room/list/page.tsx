import PageContainer from "@/shared/ui/PageContainer";
import ClassRoomContainer from "./_components/ClassRoomContainer";


const ClassRoomList = () => {
  return (
    <PageContainer
      title="Quản lý lớp học"
      breadcrumbs={[
        {
          title: "LMS",
          path: "/dashboard",
        },
        {
          title: "Quản lý lớp học",
        },
      ]}
    >
      <ClassRoomContainer />
    </PageContainer>
  )
};

export default ClassRoomList;
