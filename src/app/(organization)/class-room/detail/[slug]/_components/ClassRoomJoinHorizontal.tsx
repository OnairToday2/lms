import {
  FORMAT_DATE_LABEL_WITHOUT_HUMAN_DAY_AND_YEAR,
  FORMAT_DATE_TIME_SHORTER,
  FORMAT_TIME
} from "@/lib";
import { GetClassRoomBySlugResponse } from "@/repository/class-room";
import { QrCode } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  Typography
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import EnterClassRoomsDialog from "./EnterClassRoomsDialog";

const MAX_AVATAR = 3;

interface ClassRoomJoinProps {
  data: GetClassRoomBySlugResponse["data"];
}

export default function ClassRoomJoinHorizontal({ data }: ClassRoomJoinProps) {
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

  const handleSelectSession = (sessionId: string) => {};

  return (
    <>
      <Stack flexDirection="row" alignItems="center" justifyContent="space-between" bgcolor={"white"}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Image
            src={data?.thumbnail_url || ""}
            alt={data?.title || "thumbnail"}
            width={135}
            height={56}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />

          <Stack justifyContent={"space-between"}>
            <Typography variant="h6" fontWeight={600} noWrap>
              {data?.title}
            </Typography>
            {data?.start_at && data?.end_at ? (
              dayjs(data?.start_at).isSame(data?.end_at, "day") ? (
                <Stack direction="row" alignItems="center">
                  <Typography variant="body2" textTransform="capitalize">
                    {dayjs(data?.start_at).format(FORMAT_DATE_LABEL_WITHOUT_HUMAN_DAY_AND_YEAR)}
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      mx: 1,
                      width: 4,
                      height: 4,
                      bgcolor: "text.secondary",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography variant="body2">
                    {dayjs(data?.start_at).format(FORMAT_TIME)} - {dayjs(data?.end_at).format(FORMAT_TIME)}
                  </Typography>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center">
                  <Typography variant="body2">{dayjs(data?.start_at).format(FORMAT_DATE_TIME_SHORTER)}</Typography>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      mx: 1,
                      width: 4,
                      height: 4,
                      bgcolor: "text.secondary",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography variant="body2">{dayjs(data?.end_at).format(FORMAT_DATE_TIME_SHORTER)}</Typography>
                </Stack>
              )
            ) : (
              <Typography variant="body2">Thời gian chưa được cập nhật</Typography>
            )}
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
      </Stack>
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
    </>
  );
}
