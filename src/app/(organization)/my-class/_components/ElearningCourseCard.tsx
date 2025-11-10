"use client";
import { useRouter } from "next/navigation";
import { Image } from "@/shared/ui/Image";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { ElearningAssignedCourseDto } from "@/types/dto/elearning/elearning.dto";
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

interface IElearningCourseCard {
    assignment: ElearningAssignedCourseDto
}

const ElearningCourseCard = ({ assignment }: IElearningCourseCard) => {
    return (
        <>
            <Box className="rounded-lg border border-[#919EAB33] p-2 shadow">
                <Image
                    src={assignment.course?.thumbnail_url}
                    alt={assignment.course?.title}
                    ratio="16/9"
                    loading="lazy"
                    disabledEffect
                    className="rounded-lg"
                />
                <Box px={1}>
                    <div className="flex justify-end">
                        <div className="font-normal text-xs text-[#F63D68] bg-[#F63D6829] rounded-2xl px-1.5">
                            Môn học eLearning
                        </div>
                    </div>

                    <Box mt={2}>
                        <Typography className="font-semibold text-[14px] text-[#212B36] line-clamp-2 h-[42px]">
                            {assignment.course?.title ?? "Không có tiêu đề"}
                        </Typography>
                    </Box>

                    <Divider className="my-4" />

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <ImportContactsIcon />
                        <p className="font-normal text-xs">
                            12 học phần - 80 bài giảng
                        </p>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                        <PeopleAltOutlinedIcon />
                        <p className="font-normal text-xs">
                            <span>GV</span> Lê Thị Hồng Đào
                        </p>
                    </Stack>

                    <Box mt={2} mb={1}>
                        <Button
                            size="large"
                            variant="contained"
                            color="primary"
                            className="w-full"
                            // disabled={"actionDisabled"}
                            onClick={() => { }}
                        >
                            Vào lớp học
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default ElearningCourseCard;
