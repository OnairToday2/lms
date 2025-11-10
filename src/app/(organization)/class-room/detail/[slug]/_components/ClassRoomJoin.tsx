import { GetClassRoomBySlugResponse } from "@/repository/class-room";
import { Avatar, AvatarGroup, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import CountDown from "./CountDown";
import EnterClassRoomsDialog from "./EnterClassRoomsDialog";
import JoinButton from "./JoinButton";
import { useClassRoomJoin } from "../_hooks/useClassRoomJoin";
import QRScannerDialog from "@/modules/qr-attendance/components/QRScannerDialog";
import { useUserOrganization } from "@/modules/organization/store/UserOrganizationProvider";

const MAX_AVATAR = 3;

interface ClassRoomJoinProps {
  data: GetClassRoomBySlugResponse["data"];
  isAdminView?: boolean;
}

export default function ClassRoomJoin({ data, isAdminView }: ClassRoomJoinProps) {
  const employees = data?.employees || [];

  const employee = useUserOrganization((state) => state.data);

  const {
    dialogOpen,
    qrDialogOpen,
    selectedSessionForQR,
    isAllOnline,
    handleClickJoin,
    handleSelectSession,
    handleCloseDialog,
    closeQRDialog,
  } = useClassRoomJoin({ data, isAdminView });

  return (
    <>
      <Stack
        sx={{
          borderRadius: "12px",
          border: 1,
          borderColor: "divider",
          p: 2,
          height: "fit-content",
        }}
        gap={2}
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

        <JoinButton
          isOnline={isAllOnline}
          onClick={handleClickJoin}
          disabled={dayjs().isAfter(dayjs(data?.end_at))}
          isAdminView={isAdminView}
        />
      </Stack>
      <EnterClassRoomsDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        isOnline={isAllOnline}
        thumbnail={data?.thumbnail_url || undefined}
        sessions={data?.sessions || []}
        isAdminView={isAdminView}
        onClickJoin={handleSelectSession}
      />
      {isAdminView ? (
        <>{/* TODO: Add QR View */}</>
      ) : (
        <QRScannerDialog
          open={qrDialogOpen}
          onClose={() => {
            closeQRDialog();
          }}
          employeeId={employee?.id || ""}
          classRoomId={data?.id || ""}
          sessionId={selectedSessionForQR || ""}
          classTitle={data?.title || ""}
        />
      )}
    </>
  );
}
