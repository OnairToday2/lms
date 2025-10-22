"use client";
import dayjs, { Dayjs } from "dayjs";
import { Box, Button, Paper, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { viVN } from "@mui/x-date-pickers/locales";
import { SelectOption } from "@/shared/ui/form/SelectOption";
import { ClassRoomRuntimeStatus, ClassRoomStatus } from "../types/types";
import { PUBLICATION_STATUS_OPTIONS, RUNTIME_STATUS_OPTIONS } from "../constants";

const ITEM_LAYOUT_SX = {
  flex: { xs: "1 1 100%", md: "1 1 220px" },
  minWidth: { xs: "100%", md: 220 },
};

interface ClassRoomFiltersProps {
  search: string;
  startDate?: string | null;
  endDate?: string | null;
  runtimeStatus: ClassRoomRuntimeStatus;
  status: ClassRoomStatus;
  onSearchChange: (value: string) => void;
  onDateChange: (field: "startDate" | "endDate", value: string | null) => void;
  onRuntimeStatusChange: (runtimeStatus: ClassRoomRuntimeStatus) => void;
  onStausChange: (status: ClassRoomStatus) => void;
}

const parseDate = (value?: string | null): Dayjs | null => {
  if (!value) {
    return null;
  }
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

export default function ClassRoomFilters({
  search,
  startDate,
  endDate,
  runtimeStatus,
  status,
  onSearchChange,
  onDateChange,
  onRuntimeStatusChange,
  onStausChange,
}: ClassRoomFiltersProps) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="vi"
      localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={{ xs: 2, md: 2.5 }}
        alignItems={{ xs: "stretch", lg: "center" }}
        sx={{ flexWrap: "wrap" }}
        useFlexGap
      >
        <Box sx={ITEM_LAYOUT_SX}>
          <TextField
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm kiếm lớp học theo tên"
            size="small"
            fullWidth
          />
        </Box>
        <Box sx={ITEM_LAYOUT_SX}>
          <DatePicker
            label="Ngày bắt đầu"
            value={parseDate(startDate)}
            onChange={(newValue) => onDateChange("startDate", newValue ? newValue.toISOString() : null)}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
              },
            }}
          />
        </Box>
        <Box sx={ITEM_LAYOUT_SX}>
          <DatePicker
            label="Ngày kết thúc"
            value={parseDate(endDate)}
            onChange={(newValue) => onDateChange("endDate", newValue ? newValue.toISOString() : null)}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
              },
            }}
          />
        </Box>
        <Box sx={ITEM_LAYOUT_SX}>
          <SelectOption
            inputLabel="Trạng thái diễn ra"
            onChange={(runtimeStatus) => onRuntimeStatusChange(runtimeStatus)}
            value={runtimeStatus}
            options={RUNTIME_STATUS_OPTIONS}
            size="small"
          />
        </Box>
        <Box sx={ITEM_LAYOUT_SX}>
          <SelectOption
            inputLabel="Trạng thái xuất bản"
            onChange={(status) => onStausChange(status)}
            value={status}
            options={PUBLICATION_STATUS_OPTIONS}
            size="small"
          />
        </Box>
        <Button
          href="/class-room/create"
          variant="contained"
          color="primary"
          sx={{
            minWidth: { xs: "100%", lg: 160 },
            flex: { xs: "1 1 100%", lg: "0 0 auto" },
            alignSelf: { xs: "stretch", lg: "center" },
            py: 1.1,
          }}
        >
          Tạo lớp học
        </Button>
      </Stack>
    </LocalizationProvider>
  );
}
