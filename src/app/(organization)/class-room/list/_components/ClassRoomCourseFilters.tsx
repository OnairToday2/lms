"use client";
import dayjs, { Dayjs } from "dayjs";
import { Stack, TextField, Button, Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { viVN } from "@mui/x-date-pickers/locales";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface ClassRoomCourseFiltersProps {
  search: string;
  startDate?: string | null;
  endDate?: string | null;
  onSearchChange: (value: string) => void;
  onDateChange: (field: "startDate" | "endDate", value: string | null) => void;
  onResetFilters: () => void;
}

const parseDate = (value?: string | null): Dayjs | null => {
  if (!value) {
    return null;
  }
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

export default function ClassRoomCourseFilters({
  search,
  startDate,
  endDate,
  onSearchChange,
  onDateChange,
  onResetFilters,
}: ClassRoomCourseFiltersProps) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="vi"
      localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
      >
        <Box flex={1}>
          <TextField
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm kiếm lớp học theo tên"
            fullWidth
          />
        </Box>
        <Stack direction={"row"} alignItems={'center'} spacing={2} flex={1}>
          <DatePicker
            label="Ngày bắt đầu"
            value={parseDate(startDate)}
            onChange={(newValue) =>
              onDateChange("startDate", newValue ? newValue.toISOString() : null)
            }
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small",
              },
            }}
          />
          <DatePicker
            label="Ngày kết thúc"
            value={parseDate(endDate)}
            onChange={(newValue) =>
              onDateChange("endDate", newValue ? newValue.toISOString() : null)
            }
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small",
              },
            }}
          />
          <Button size="medium" variant="outlined" color="inherit" onClick={onResetFilters}>
            Đặt lại
          </Button>
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
}
