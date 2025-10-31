import { Image } from "@/shared/ui/Image";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { fDateTime } from "@/lib";


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
}

const ClassRoomCard = ({ actionLabel, end_at, participantCount, runtimeStatusColor, runtimeStatusLabel, sessionModeLabel, start_at, thumbnail, title, actionDisabled }: IClassRoomCard) => {
    return (
        <Box className="rounded-lg border border-[#919EAB33] p-2 shadow">
            <Image
                src={"item.thumbnail_url"}
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
                        <AccessTimeIcon className="w-[20px] h-[20px]" />
                        <Typography className="font-normal text-[12px] text-[#212B36]">
                            {fDateTime(start_at)} -  {fDateTime(end_at)}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                        <GroupOutlinedIcon className="w-[20px] h-[20px]" />
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
                    >
                        {actionLabel}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ClassRoomCard;