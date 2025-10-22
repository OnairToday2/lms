"use client";
import {
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
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { ClassRoomPriority, ClassRoomRuntimeStatus, ClassRoomStatus, ClassRoomType } from "../../types/types";
import {
  getClassRoomRuntimeStatusLabel,
  getClassRoomStatusLabel,
  getClassRoomTypeLabel,
  getColorClassRoomRuntimeStatus,
  getColorClassRoomStatus
} from "../../utils/status";
import { TABLE_HEAD } from "../../constants";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";

interface ClassRoomListTableProps {
  classRooms: ClassRoomPriority[];
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

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ borderColor: "divider", overflow: "hidden" }}>
      <TableContainer>
        <Table aria-label="Danh sách lớp học trực tuyến">
          <TableHead sx={{ backgroundColor: grey[100] }}>
            <TableRow>
              {TABLE_HEAD.map((item) => {
                return <TableCell key={item.id} sx={{ width: item.width }}>{item.label}</TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {classRooms.map((room, index) => {
              const order = formatOrder(startIndex + index + 1);
              return (
                <TableRow
                  key={room.id ?? `${room.title}-${index}`}
                  sx={{
                    "&:last-child td": { borderBottom: "none" },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{order}</TableCell>
                  <TableCell>
                    <Stack direction="column" alignItems="flex-start">
                      <Chip
                        label={getClassRoomTypeLabel(room?.room_type as ClassRoomType)}
                        color="warning"
                      />
                      <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {room.title ?? "Không có tiêu đề"}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>123</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      456
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getClassRoomStatusLabel(room?.status as ClassRoomStatus)}
                      size="small"
                      color={getColorClassRoomStatus(room?.status as ClassRoomStatus)}
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getClassRoomRuntimeStatusLabel(room?.runtime_status as ClassRoomRuntimeStatus)}
                      size="small"
                      color={getColorClassRoomRuntimeStatus(room?.runtime_status as ClassRoomRuntimeStatus)}
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2">789</Typography>
                      <Typography variant="caption" color="text.secondary">
                        000
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={handleClick}
                      id="basic-button"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      slotProps={{
                        list: {
                          'aria-labelledby': 'basic-button',
                        },
                      }}
                    >
                      <MenuItem onClick={handleClose}>Xem chi tiết lớp học</MenuItem>
                      <MenuItem onClick={handleClose}>Chỉnh sửa</MenuItem>
                      <MenuItem onClick={handleClose}>Xoá lớp học</MenuItem>
                      <MenuItem onClick={handleClose}>Danh sách học viên</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
