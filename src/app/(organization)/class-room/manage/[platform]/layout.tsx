import { redirect } from "next/navigation";
import { CLASS_ROOM_PLATFORM } from "@/constants/class-room.constant";
import { PATHS } from "@/constants/path.contstants";
interface ClassRoomPlatformLayoutProps {
  params: Promise<{
    platform: (typeof CLASS_ROOM_PLATFORM)[keyof typeof CLASS_ROOM_PLATFORM];
  }>;
  children: React.ReactNode;
}

const CLASS_ROOM_PREFIX_PATHS = [CLASS_ROOM_PLATFORM.ONLINE, CLASS_ROOM_PLATFORM.OFFLINE, CLASS_ROOM_PLATFORM.HYBRID];
export default async function ClassRoomPlatformLayout({ children, params }: ClassRoomPlatformLayoutProps) {
  const { platform } = await params;
  if (!CLASS_ROOM_PREFIX_PATHS.includes(platform)) {
    redirect(PATHS.CLASSROOMS.ROOT);
  }

  return children;
}
