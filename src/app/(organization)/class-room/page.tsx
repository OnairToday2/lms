import PageContainer from "@/shared/ui/PageContainer";
import * as React from "react";
import BoxMenuClassList from "./_components/BoxMenuClassList";
import { PATHS } from "@/constants/path.contstants";
interface ManageClassRoomPageProps {}

const CLASS_MENU_LIST = [
  {
    title: "Tạo lớp học online",
    path: `${PATHS.CLASSROOMS.ROOT}/manage/online/create`,
  },
  {
    title: "Tạo lớp học offline",
    path: `${PATHS.CLASSROOMS.ROOT}/manage/offline/create`,
  },
];
export default function ManageClassRoomPage({}: ManageClassRoomPageProps) {
  return (
    <PageContainer title="Danh sách lớp học" breadcrumbs={[{ title: "Quản lý lớp học" }]}>
      <BoxMenuClassList items={CLASS_MENU_LIST} />
    </PageContainer>
  );
}
