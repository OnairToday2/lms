"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Stack,
  Typography,
  Chip,
  Button,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { ClassRoom, ClassRoomRuntimeStatus, ClassRoomSession } from "../types/types";
import {
  getClassRoomStatus,
  getColorClassRoomStatus,
  getStatusAndLabelBtnJoin
} from "../utils/status";
import ClassRoomParticipantsDialog from "./ClassRoomParticipantsDialog";
import SessionListDialog from "./SessionListDialog";
import ClassRoomDetailDialog from "./ClassRoomDetailDialog";
import { fDateTime } from "@/lib";
import { Image } from "@/shared/ui/Image";

interface ClassRoomCardProps {
  classRoom: ClassRoom;
}

export default function ClassRoomCard({ classRoom }: ClassRoomCardProps) {
  const [showAssigned, setShowAssigned] = useState(false);
  const [showAttended, setShowAttended] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [countdownSession, setCountdownSession] = useState<ClassRoomSession | null>(
    null,
  );
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const runtimeStatus = classRoom?.runtime_status as ClassRoomRuntimeStatus;
  const { disabled, label } = getStatusAndLabelBtnJoin(runtimeStatus)
  const handleJoin = () => {

  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Stack spacing={2} flex={1}>
            <Stack direction="row" justifyContent="space-between">
              <Chip
                label={getClassRoomStatus(runtimeStatus)}
                color={getColorClassRoomStatus(runtimeStatus)}
                size="medium"
              />
              <Chip
                label={classRoom.room_type === "single" ? "Lớp học đơn" : "lớp học chuỗi"}
                color={classRoom.room_type === "single" ? "primary" : "warning"}
                size="medium"
              />
            </Stack>

            <Image
              src={classRoom.thumbnail_url}
              alt=""
              width={1}
              height={1}
              className="w-full h-[200px] object-cover rounded-[8px]"
            />

            <Stack spacing={1}>
              <Button
                variant="text"
                color="primary"
                onClick={() => setShowDetail(true)}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  fontSize: 18,
                  fontWeight: 600,
                  px: 0,
                }}
              >
                {classRoom.title}
              </Button>
              {classRoom.description ? (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {classRoom.description}
                </Typography>
              ) : null}
            </Stack>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Thời gian diễn ra
              </Typography>
              <Typography variant="body2">
                {`${fDateTime(classRoom.start_at)} - ${fDateTime(classRoom.end_at)}`}
              </Typography>
            </Box>

          </Stack>
        </CardContent>
        <Divider />
        <CardActions
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 2,
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            startIcon={<PlayArrowRoundedIcon />}
            disabled={disabled}
            onClick={handleJoin}
          >
            {label}
          </Button>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button variant="outlined" onClick={() => setShowAssigned(true)}>
              Người được gán
            </Button>
            <Button variant="outlined" onClick={() => setShowAttended(true)}>
              Người tham gia
            </Button>
          </Stack>
        </CardActions>
      </Card>

      {/* <ClassRoomParticipantsDialog
        open={showAssigned}
        onClose={() => setShowAssigned(false)}
        title="Người được gán vào lớp học"
        participants={Array(123)}
        getSessionName={(sessionId) => sessionMap.get(sessionId) ?? sessionId}
      />
      <ClassRoomParticipantsDialog
        open={showAttended}
        onClose={() => setShowAttended(false)}
        title="Người đã tham gia lớp học"
        participants={Array(123)}
        getSessionName={(sessionId) => sessionMap.get(sessionId) ?? sessionId}
      /> */}
      <SessionListDialog
        open={showSessions}
        onClose={() => setShowSessions(false)}
        classRoom={classRoom}
      // onJoinSession={handleJoinSession}
      />
      <ClassRoomDetailDialog
        open={showDetail}
        onClose={() => setShowDetail(false)}
        classRoom={classRoom}
      />
      <Dialog
        open={Boolean(countdownSession)}
        onClose={() => setCountdownSession(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chuẩn bị vào lớp học</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography>
              Bạn sẽ được chuyển tới trang countdown cho buổi{" "}
              <strong>{countdownSession?.title}</strong>.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chức năng chuyển trang countdown chưa được cấu hình trong bản
              dựng này. Vui lòng kiểm tra lại khi tính năng hoàn thiện.
            </Typography>
            <Typography variant="body2">
              Thời gian bắt đầu:{" "}
              {/* {countdownSession
                ? formatSingleSessionRange(countdownSession)
                : "-"} */}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCountdownSession(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Đăng tải lớp học</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Lớp học hiện đang ở trạng thái nháp. Thực hiện thao tác đăng tải
            trong trang quản trị để công khai lớp học cho học viên.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPublishDialog(false)} variant="contained">
            Đã hiểu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
