import { GetClassRoomBySlugResponse } from "@/repository/class-room";
import { QrCode } from "@mui/icons-material";
import { Avatar, AvatarGroup, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import CountDown from "./CountDown";
import EnterClassRoomsDialog from "./EnterClassRoomsDialog";
import { PATHS } from "@/constants/path.contstants";
import { useRouter } from "next/navigation";

const MAX_AVATAR = 3;

interface ClassRoomJoinProps {
  data: GetClassRoomBySlugResponse["data"];
}

export default function ClassRoomJoin({ data }: ClassRoomJoinProps) {
  const router = useRouter();
  const employees = data?.employees || [];

  const isSingle = data?.room_type === "single";
  const isOnline = data?.sessions.every((session) => session.is_online) ?? true;

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickJoin = () => {
    if (!isSingle) {
      setDialogOpen(true);
      return;
    }
  };

  const handleSelectSession = (sessionId: string) => {
    if (!isOnline) {
      // handle QR code
      return;
    }
    return router.push(PATHS.CLASSROOMS.COUNTDOWN_CLASSROOM(data!.slug || "", sessionId));
  };

  return (
    <Stack
      sx={{
        borderRadius: "12px",
        border: 1,
        borderColor: "divider",
        p: 2,
        height: "fit-content",
      }}
    >
      <Stack
        sx={{
          bgcolor: "primary.lighter",
          px: 2,
          pt: 1,
          pb: 3,
          borderRadius: 2,
        }}
        spacing={1}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" align="left" flex={1} color="textPrimary">
            Bắt đầu sau:
          </Typography>
          {data?.start_at && <CountDown startDate={data.start_at} disabled={false} />}
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={0.75} alignItems="center">
            <AvatarGroup
              spacing={6}
              slotProps={{
                additionalAvatar: {
                  sx: { width: 24, height: 24, fontSize: 10 },
                },
              }}
              sx={{ ".MuiAvatarGroup-avatar": { fontSize: 10 } }}
              total={Math.min(employees.length, MAX_AVATAR)}
            >
              {employees.map((element) => (
                <Avatar
                  key={element.employee?.id}
                  sx={{ width: 16, height: 16 }}
                  alt={element?.employee?.profile?.full_name || "Unknown"}
                  src={element?.employee?.profile?.avatar || "/default-avatar.png"}
                />
              ))}
            </AvatarGroup>
            <Typography color="textPrimary" variant="subtitle2">
              {employees.length - MAX_AVATAR > 0 && employees.length > 0
                ? `+${employees.length - MAX_AVATAR} học viên`
                : "học viên"}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 2, textTransform: "none" }}
        endIcon={isOnline ? undefined : <QrCode />}
        onClick={handleClickJoin}
      >
        {isOnline ? "Vào lớp học" : "Quét mã QR điểm danh"}
      </Button>
      <EnterClassRoomsDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        isOnline={isOnline}
        thumbnail={data?.thumbnail_url || undefined}
        sessions={data?.sessions || []}
        onSelectSession={handleSelectSession}
      />
    </Stack>
  );
}
