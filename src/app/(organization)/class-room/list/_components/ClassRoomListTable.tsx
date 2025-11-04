"use client";
import {
  AvatarGroup,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Tooltip,
  Button,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ClassRoomPriorityDto, EmployeeWithProfileDto } from "@/types/dto/classRooms/classRoom.dto";
import { fDate, FORMAT_DATE_TIME } from "@/lib";
import { useDeleteClassRoomMutation } from "@/modules/class-room-management/operations/mutation";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/shared/ui/custom-dialog";
import { useState } from "react";
import { TABLE_HEAD } from "../constants";
import { ClassRoomRuntimeStatusFilter, ClassRoomStatusFilter, ClassRoomTypeFilter } from "../types/types";
import { getClassRoomRuntimeStatusLabel, getClassRoomStatusLabel, getClassRoomTypeLabel, getColorClassRoomRuntimeStatus, getColorClassRoomStatus } from "../utils/status";


interface ClassRoomListTableProps {
  classRooms: ClassRoomPriorityDto[];
  page: number;
  pageSize: number;
}
const formatOrder = (index: number) => index.toString().padStart(2, "0");

export default function ClassRoomListTable({
  classRooms,
  page,
  pageSize,
}: ClassRoomListTableProps) {
  const startIndex = (page - 1) * pageSize;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: deleteClassRoom, isPending } = useDeleteClassRoomMutation();
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  const [isAllowDelete, setIsAllowDelete] = useState(false);
  const [classRoomId, setClassRoomId] = useState<string>();

  const handleOpenDeleteClassRoom = (room: ClassRoomPriorityDto) => {
    setClassRoomId(room.id as string);
    setIsOpenDialogDelete(true);

    if (room.status === ClassRoomStatusFilter.Daft) {
      setIsAllowDelete(true);
    } else if (room.status === ClassRoomStatusFilter.Publish && room?.assignees?.length === 0) {
      setIsAllowDelete(true);
    } else {
      setIsAllowDelete(false);
    }
  }

  const handleDeleteClassRoom = async () => {
    if (classRoomId) {
      await deleteClassRoom(classRoomId);
      queryClient.invalidateQueries({ queryKey: ["class-rooms-priority"] })
      setIsOpenDialogDelete(false);
    }
  }

  return (
    <>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <TableContainer>
          <Table
            aria-label="Danh sách lớp học trực tuyến"
            sx={{
              tableLayout: "fixed",
              "& .MuiTableCell-root": {
                py: 2,
                px: 2,
              },
            }}
          >
            <TableHead
              sx={{
                backgroundColor: grey[100],
                "& .MuiTableCell-head": {
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: 0.2,
                  color: grey[700],
                },
              }}
            >
              <TableRow>
                {TABLE_HEAD.map((item) => {
                  return (
                    <TableCell
                      key={item.id}
                      sx={{
                        width: item.width,
                        whiteSpace: "nowrap",
                      }}
                      align={item.align}
                    >
                      {item.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "& .MuiTableCell-root": {
                  borderBottomColor: grey[200],
                  verticalAlign: "middle",
                },
              }}
            >
              {classRooms.map((room, index) => {
                const order = formatOrder(startIndex + index + 1);
                const teacherAssignments =
                  room.class_sessions?.flatMap((session) => session.teacherAssignments ?? []) ?? [];

                const teacherMap = new Map<string, EmployeeWithProfileDto>();
                teacherAssignments.forEach((assignment) => {
                  const teacher = assignment.teacher;
                  if (!teacher?.id) {
                    return;
                  }
                  if (!teacherMap.has(teacher.id)) {
                    teacherMap.set(teacher.id, teacher);
                  }
                });

                const teachers = Array.from(teacherMap.values());
                const creatorName =
                  room.creator?.profile?.full_name ?? room.creator?.employee_code ?? "Chưa cập nhật";
                return (
                  <TableRow
                    key={room.id ?? `${room.title}-${index}`}
                    sx={{
                      "&:last-child td": { borderBottom: "none" },
                      "&:hover": {
                        backgroundColor: grey[50],
                      },
                    }}
                  >
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {order}
                    </TableCell>
                    <TableCell align="left">
                      <Stack direction="column" alignItems="flex-start">
                        <Chip
                          label={getClassRoomTypeLabel(room?.room_type as ClassRoomTypeFilter)}
                          color="warning"
                        />
                        <Typography variant="subtitle2" fontWeight={600} className="line-clamp-2">
                          {room.title || "--"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <AvatarGroup sx={{ justifyContent: "center" }} variant="circular" max={4}>
                        {teachers.map((teacher) => {
                          return (
                            <Tooltip key={teacher.profile?.id} title={teacher.profile?.full_name}>
                              <Avatar
                                alt={teacher.profile?.full_name}
                                src={teacher.profile?.avatar as string}
                                sx={{ width: 24, height: 24 }}
                              />
                            </Tooltip>
                          )
                        })}
                      </AvatarGroup>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2">
                        {room?.studentCount?.[0].count}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getClassRoomStatusLabel(room?.status as ClassRoomStatusFilter)}
                        size="small"
                        color={getColorClassRoomStatus(room?.status as ClassRoomStatusFilter)}
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getClassRoomRuntimeStatusLabel(room?.runtime_status as ClassRoomRuntimeStatusFilter)}
                        size="small"
                        color={getColorClassRoomRuntimeStatus(room?.runtime_status as ClassRoomRuntimeStatusFilter)}
                        variant="filled"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          src={room.creator?.profile?.avatar as string}
                          sx={{ width: 24, height: 24 }}
                        />
                        <Stack>
                          <Typography variant="caption">{creatorName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {fDate(room.created_at, FORMAT_DATE_TIME)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <>
                            <IconButton {...bindTrigger(popupState)}>
                              <MoreVertIcon />
                            </IconButton>
                            <Menu {...bindMenu(popupState)}>
                              <MenuItem onClick={() => { }}>Xem chi tiết lớp học</MenuItem>
                              <MenuItem onClick={() => { }}>Chỉnh sửa</MenuItem>
                              <MenuItem onClick={() => handleOpenDeleteClassRoom(room)}>Xoá lớp học</MenuItem>
                              <MenuItem onClick={() => { router.push(`${room.id}/students`) }}>Danh sách học viên</MenuItem>
                            </Menu>
                          </>
                        )}
                      </PopupState>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ConfirmDialog
        open={isOpenDialogDelete}
        onClose={() => setIsOpenDialogDelete(false)}
        title={isAllowDelete ? "Xác nhận xoá lớp học trực tuyến" : "Không thể xoá lớp học"}
        content={isAllowDelete ? "Bạn có chắc muốn xoá lớp học này? Hành động này sẽ xoá toàn bộ thông tin đã tạo và không thể hoàn tác." : "Lớp học này đã có học viên tham gia. Vui lòng gỡ học viên ra khỏi trước khi thực hiện thao tác này."}
        action={
          <>
            <Button variant="contained" color="error" onClick={handleDeleteClassRoom} disabled={!isAllowDelete}>
              Xoá lớp học
            </Button>
          </>
        }
      />
    </>
  );
}
