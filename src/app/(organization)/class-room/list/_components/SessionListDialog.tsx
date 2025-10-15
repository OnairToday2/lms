"use client";
import dayjs from "dayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Stack,
  Chip,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { ClassRoomRuntimeStatus, ClassRoomWithStatus } from "../types/types";
import { resolveSessionStatus } from "../utils/status";

interface SessionListDialogProps {
  open: boolean;
  onClose: () => void;
  classRoom: ClassRoomWithStatus;
  onJoinSession?: (session: ClassRoomWithStatus["sessions"][number]) => void;
}

const STATUS_COLORS: Record<ClassRoomRuntimeStatus, "default" | "success" | "info" | "warning" | "error"> =
{
  [ClassRoomRuntimeStatus.All]: "default",
  [ClassRoomRuntimeStatus.Ongoing]: "success",
  [ClassRoomRuntimeStatus.Today]: "info",
  [ClassRoomRuntimeStatus.Upcoming]: "warning",
  [ClassRoomRuntimeStatus.Past]: "default",
  [ClassRoomRuntimeStatus.Draft]: "default",
};

const STATUS_LABELS: Record<ClassRoomRuntimeStatus, string> = {
  [ClassRoomRuntimeStatus.All]: "Tất cả",
  [ClassRoomRuntimeStatus.Ongoing]: "Đang diễn ra",
  [ClassRoomRuntimeStatus.Today]: "Diễn ra hôm nay",
  [ClassRoomRuntimeStatus.Upcoming]: "Sắp diễn ra",
  [ClassRoomRuntimeStatus.Past]: "Đã diễn ra",
  [ClassRoomRuntimeStatus.Draft]: "Bản nháp",
};

const formatSessionRange = (start: string, end?: string) => {
  const startDate = dayjs(start);
  const endDate = end ? dayjs(end) : undefined;
  if (!startDate.isValid()) {
    return "-";
  }
  if (endDate && endDate.isValid()) {
    return `${startDate.format("HH:mm DD/MM/YYYY")} - ${endDate.format("HH:mm DD/MM/YYYY")}`;
  }
  return startDate.format("HH:mm DD/MM/YYYY");
};

export default function SessionListDialog({
  open,
  onClose,
  classRoom,
  onJoinSession,
}: SessionListDialogProps) {
  const now = dayjs();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Danh sách buổi học - {classRoom?.title}</DialogTitle>
      <DialogContent dividers>
        {classRoom?.sessions?.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Khóa học chưa có thông tin buổi học.
          </Typography>
        ) : (
          <List disablePadding>
            {classRoom?.sessions?.map((session, index) => {
              const status = resolveSessionStatus(session, now);
              return (
                <Stack key={session.id} spacing={1}>
                  <ListItem
                    secondaryAction={
                      <Button
                        variant="contained"
                        disabled={status === ClassRoomRuntimeStatus.Past}
                        onClick={() => onJoinSession?.(session)}
                      >
                        {status === ClassRoomRuntimeStatus.Past
                          ? "Đã diễn ra"
                          : "Tham gia"}
                      </Button>
                    }
                    alignItems="flex-start"
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle1">
                            {session.title}
                          </Typography>
                          <Chip
                            label={STATUS_LABELS[status]}
                            color={STATUS_COLORS[status]}
                            size="small"
                          />
                        </Stack>
                      }
                      secondary={
                        <>
                          <Typography component="div" variant="body2">
                            {formatSessionRange(session.startAt, session.endAt)}
                          </Typography>
                          {session?.description ? (
                            <Typography variant="body2" color="text.secondary">
                              {session?.description}
                            </Typography>
                          ) : null}
                        </>
                      }
                    />
                  </ListItem>
                  {index < classRoom?.sessions.length - 1 ? <Divider /> : null}
                </Stack>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
