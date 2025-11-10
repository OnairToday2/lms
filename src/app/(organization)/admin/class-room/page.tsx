import PageContainer from "@/shared/ui/PageContainer";
import * as React from "react";
import BoxMenuClassList from "./_components/BoxMenuClassList";
import { Metadata, ResolvingMetadata } from "next";
interface ManageClassRoomPageProps {}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  return {
    title: "Quản lý lớp học",
    description: "Quản lý lớp học",
  };
}

export default function ManageClassRoomPage({}: ManageClassRoomPageProps) {
  return (
    <PageContainer title="Tạo lớp học" breadcrumbs={[{ title: "Dashboard" }, { title: "Tạo lớp học" }]}>
      <BoxMenuClassList />
    </PageContainer>
  );
}
