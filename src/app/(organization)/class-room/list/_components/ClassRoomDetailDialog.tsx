"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import { ClassRoom } from "../types/types";
import {
  getClassRoomStatus,
  getColorClassRoomStatus
} from "../utils/status";
import { fDateTime } from "@/lib";
import { resolveSessionStatus } from "@/modules/class-room-management/utils/runtimeStatus";

interface ClassRoomDetailDialogProps {
  open: boolean;
  onClose: () => void;
  classRoom: ClassRoom;
}


export default function ClassRoomDetailDialog({
  open,
  onClose,
  classRoom,
}: ClassRoomDetailDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết Lớp học trực tuyến</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">{classRoom.title}</Typography>
          </Stack>
          {classRoom.description ? (
            <Typography variant="body1">{classRoom.description}</Typography>
          ) : null}

          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Thời gian bắt đầu - kết thúc
              </Typography>
              <Typography variant="body2">
                {`${fDateTime(classRoom.start_at)} - ${fDateTime(classRoom.end_at)}`}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Số người được gán
              </Typography>
              <Typography variant="body2">
                100
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="subtitle1">Danh sách buổi học</Typography>
          <Stack spacing={1}>
            {classRoom?.class_sessions?.map((session) => {
              const sessionStatus = session.runtimeStatus ?? resolveSessionStatus(session);

              return (
                <Stack
                  key={session.id}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  border={1}
                  borderColor="divider"
                  borderRadius={1.5}
                  p={1.5}
                >
                  <Stack flex={1} spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle2">
                        {session.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={getClassRoomStatus(sessionStatus)}
                        color={getColorClassRoomStatus(sessionStatus)}
                      />
                    </Stack>
                    <Typography variant="body2">
                      {`${fDateTime(session.start_at)} - ${fDateTime(session.end_at)}`}
                    </Typography>
                    {session.description ? (
                      <Typography variant="body2" color="text.secondary">
                        {session.description}
                      </Typography>
                    ) : null}
                  </Stack>
                </Stack>
              );
            })}
            {classRoom?.class_sessions?.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Khóa học chưa có buổi học nào.
              </Typography>
            )}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
