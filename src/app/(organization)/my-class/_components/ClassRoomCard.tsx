"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Image } from "@/shared/ui/Image";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { fDateTime } from "@/lib";
import EnterClassRoomsDialog from "./EnterClassRooms";
import { ClassRoomPriorityDto } from "@/types/dto/classRooms/classRoom.dto";
import { ClassRoomType } from "../../class-room/list/types/types";


interface IClassRoomCard {
    start_at: string
    end_at: string
    title: string
    participantCount: number
    actionLabel: string
    runtimeStatusColor: string
    runtimeStatusLabel: string
    sessionModeLabel: string
    thumbnail: string
    actionDisabled: boolean
    slug?: string
    roomType?: ClassRoomType
    sessions?: ClassRoomPriorityDto["class_sessions"]
    isOnline: boolean
}

const ClassRoomCard = ({
    actionLabel,
    end_at,
    participantCount,
    runtimeStatusColor,
    runtimeStatusLabel,
    sessionModeLabel,
    start_at,
    thumbnail,
    title,
    actionDisabled,
    slug,
    roomType = ClassRoomType.Single,
    sessions = [],
    isOnline,
}: IClassRoomCard) => {
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);

    const navigateToSession = useCallback((sessionId?: string) => {
        if (!sessionId || !slug) {
            return;
        }
        router.push(`/class-room/${slug}/${sessionId}`);
    }, [router, slug]);

    const handleJoinClass = useCallback(() => {
        if (actionDisabled) {
            return;
        }

        if (isOnline) {
            if (roomType === ClassRoomType.Multiple) {
                setDialogOpen(true);
                return;
            }

            if (sessions?.[0]?.id) {
                navigateToSession(sessions?.[0]?.id);
            }
        } else {
            if (roomType === ClassRoomType.Multiple) {
                setDialogOpen(true);
                return;
            }
            // xử lý btn quét mã qr khi là lớp học offline đơn
            return;
        }
    }, [actionDisabled, isOnline, navigateToSession, roomType, sessions]);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const handleSelectSession = useCallback((sessionId: string) => {
        if (!isOnline) {
            //  xử lý btn quét mã qr khi là lớp học offline chuỗi
            return;
        }
        setDialogOpen(false);
        navigateToSession(sessionId);
    }, [isOnline, navigateToSession]);

    return (
        <>
            <Box className="rounded-lg border border-[#919EAB33] p-2 shadow">
                <Image
                    src={thumbnail}
                    alt={title ?? "classroom"}
                    ratio="16/9"
                    loading="lazy"
                    disabledEffect
                    className="rounded-lg"
                />
                <Box px={1}>
                    <Stack mt={2} direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography className="font-semibold text-[12px]" sx={{ color: runtimeStatusColor }}>
                                {runtimeStatusLabel}
                            </Typography>
                        </Box>
                        <Chip label={sessionModeLabel} variant="outlined" color="primary" />
                    </Stack>

                    <Box mt={2}>
                        <Typography className="font-semibold text-[14px] text-[#212B36]">
                            {title ?? "Không có tiêu đề"}
                        </Typography>
                    </Box>

                    <Divider className="my-4" />

                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AccessTimeIcon className="w-5" />
                            <Typography className="font-normal text-[12px] text-[#212B36]">
                                {fDateTime(start_at)} -  {fDateTime(end_at)}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                            <GroupOutlinedIcon className="w-5" />
                            <Typography className="font-normal text-[12px] text-[#212B36]">
                                <span className=" font-semibold">
                                    {participantCount}
                                </span>{" "}
                                <span className="font-normal">Học viên</span>
                            </Typography>
                        </Stack>
                    </Box>

                    <Box mt={2} mb={1}>
                        <Button
                            size="large"
                            variant="contained"
                            color="primary"
                            className="w-full"
                            disabled={actionDisabled}
                            onClick={handleJoinClass}
                        >
                            {actionLabel}
                        </Button>
                    </Box>
                </Box>
            </Box>
            <EnterClassRoomsDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                sessions={sessions}
                thumbnail={thumbnail}
                classTitle={title}
                actionLabel={!isOnline ? "Quét mã QR" : undefined}
                onSelectSession={handleSelectSession}
            />
        </>
    );
}

export default ClassRoomCard;
