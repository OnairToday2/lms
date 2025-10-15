"use client";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Divider,
} from "@mui/material";
import { ClassRoomParticipant } from "../types/types";
import { normalizeText } from "../utils/filter";

interface ClassRoomParticipantsDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  participants: ClassRoomParticipant[];
  getSessionName?: (sessionId: string) => string;
}

const ATTENDANCE_LABEL: Record<
  NonNullable<ClassRoomParticipant["attendanceStatus"]>,
  string
> = {
  attended: "Có tham gia",
  absent: "Không tham gia",
  pending: "Chưa xác định",
};

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }
  const date = dayjs(value);
  if (!date.isValid()) {
    return "-";
  }
  return date.format("HH:mm DD/MM/YYYY");
};

const uniqueValues = (
  participants: ClassRoomParticipant[],
  getter: (participant: ClassRoomParticipant) => string | undefined,
) => {
  const set = new Set<string>();
  participants?.forEach((participant) => {
    const value = getter(participant);
    if (value) {
      set.add(value);
    }
  });
  return Array.from(set);
};

export default function ClassRoomParticipantsDialog(
  props: ClassRoomParticipantsDialogProps,
) {
  const { open, onClose, title, participants, getSessionName } = props;
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("all");
  const [branch, setBranch] = useState<string>("all");
  const [attendance, setAttendance] = useState<string>("all");

  const departments = useMemo(
    () =>
      uniqueValues(participants, (participant) => participant.department).sort(),
    [participants],
  );
  const branches = useMemo(
    () =>
      uniqueValues(participants, (participant) => participant.branch).sort(),
    [participants],
  );

  const filteredParticipants = useMemo(() => {
    return participants?.filter((participant) => {
      if (search.trim()) {
        const normalizedValue = normalizeText(search);
        const fields = [
          participant.fullName,
          participant.email,
          participant.phoneNumber,
          participant.userCode,
        ];
        const matchesSearch = fields.some((field) =>
          field ? normalizeText(field).includes(normalizedValue) : false,
        );
        if (!matchesSearch) {
          return false;
        }
      }

      if (department !== "all" && participant.department !== department) {
        return false;
      }

      if (branch !== "all" && participant.branch !== branch) {
        return false;
      }

      if (
        attendance !== "all" &&
        participant.attendanceStatus !== attendance
      ) {
        return false;
      }

      return true;
    });
  }, [participants, search, department, branch, attendance]);

  const resetFilters = () => {
    setSearch("");
    setDepartment("all");
    setBranch("all");
    setAttendance("all");
  };

  useEffect(() => {
    if (!open) {
      resetFilters();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="course-participants-dialog"
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle id="course-participants-dialog">
        {title} ({filteredParticipants?.length})
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Tìm kiếm"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Mã nhân viên, tên, email hoặc số điện thoại"
              size="small"
              fullWidth
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="department-filter-label">Phòng ban</InputLabel>
              <Select
                labelId="department-filter-label"
                value={department}
                label="Phòng ban"
                onChange={(event) => setDepartment(event.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {departments.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="branch-filter-label">Chi nhánh</InputLabel>
              <Select
                labelId="branch-filter-label"
                value={branch}
                label="Chi nhánh"
                onChange={(event) => setBranch(event.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {branches.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="attendance-filter-label">Điểm danh</InputLabel>
              <Select
                labelId="attendance-filter-label"
                value={attendance}
                label="Điểm danh"
                onChange={(event) => setAttendance(event.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="attended">Có tham gia</MenuItem>
                <MenuItem value="absent">Không tham gia</MenuItem>
                <MenuItem value="pending">Chưa xác định</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={resetFilters} variant="outlined" color="inherit">
              Xóa lọc
            </Button>
          </Stack>

          <Divider />

          {filteredParticipants?.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Không tìm thấy dữ liệu phù hợp với tiêu chí lọc hiện tại.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Mã nhân viên</TableCell>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Phòng ban</TableCell>
                  <TableCell>Chi nhánh</TableCell>
                  <TableCell>Thời gian gán</TableCell>
                  <TableCell>Điểm danh</TableCell>
                  <TableCell>Vào lớp</TableCell>
                  <TableCell>Kết thúc</TableCell>
                  <TableCell>Buổi tham gia</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredParticipants?.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>{participant.userCode}</TableCell>
                    <TableCell>{participant.fullName}</TableCell>
                    <TableCell>{participant.email ?? "-"}</TableCell>
                    <TableCell>{participant.phoneNumber ?? "-"}</TableCell>
                    <TableCell>{participant.department ?? "-"}</TableCell>
                    <TableCell>{participant.branch ?? "-"}</TableCell>
                    <TableCell>{formatDateTime(participant.assignedAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          ATTENDANCE_LABEL[
                          participant.attendanceStatus ?? "pending"
                          ]
                        }
                        color={
                          participant.attendanceStatus === "attended"
                            ? "success"
                            : participant.attendanceStatus === "absent"
                              ? "error"
                              : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDateTime(participant.attendAt)}</TableCell>
                    <TableCell>{formatDateTime(participant.leaveAt)}</TableCell>
                    <TableCell>
                      {participant.sessionIds?.length ? (
                        <Stack direction="row" flexWrap="wrap" gap={0.5}>
                          {participant.sessionIds.map((sessionId) => (
                            <Chip
                              key={sessionId}
                              label={
                                getSessionName
                                  ? getSessionName(sessionId)
                                  : sessionId
                              }
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
