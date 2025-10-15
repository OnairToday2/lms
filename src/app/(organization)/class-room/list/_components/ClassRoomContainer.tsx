"use client";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import PageContainer from "@/shared/ui/PageContainer";
import {
  ClassRoom,
  ClassRoomFilters,
  ClassRoomRuntimeStatus,
} from "../types/types";
import CourseFiltersBar from "./ClassRoomCourseFilters";
import CourseStatusTabs from "./ClassRoomStatusTabs";
import {
  GetClassRoomsQueryInput,
  useCountStatusClassRoomsQuery,
  useGetClassRoomsQuery,
} from "@/modules/classRoom/query";
import ClassRoomGrid from "./ClassRoomGrid";

const initialFilters: ClassRoomFilters = {
  search: "",
  status: ClassRoomRuntimeStatus.All,
  startDate: null,
  endDate: null,
};

export default function ClassRoomContainer() {
  const [filters, setFilters] = useState<ClassRoomFilters>(initialFilters);

  const queryInput = useMemo<GetClassRoomsQueryInput>(() => {
    const trimmedSearch = filters.search.trim();
    return {
      q: trimmedSearch ? trimmedSearch : undefined,
      from: filters.startDate
        ? dayjs(filters.startDate).startOf("day").toISOString()
        : undefined,
      to: filters.endDate
        ? dayjs(filters.endDate).endOf("day").toISOString()
        : undefined,
      status: filters.status,
    };
  }, [filters.search, filters.startDate, filters.endDate, filters.status]);

  const { data: classRooms, isLoading, isError, refetch } =
    useGetClassRoomsQuery(queryInput);

  const { data: countStatus } = useCountStatusClassRoomsQuery()


  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    value: string | null,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      startDate: null,
      endDate: null,
    }));
  };

  const handleStatusChange = (status: ClassRoomRuntimeStatus) => {
    setFilters((prev) => ({
      ...prev,
      status,
    }));
  };

  console.log("classRoom", classRooms);


  return (
    <PageContainer
      title="Danh sách Lớp học trực tuyến"
    >
      <Stack spacing={3}>
        <CourseFiltersBar
          search={filters.search}
          startDate={filters.startDate}
          endDate={filters.endDate}
          onSearchChange={handleSearchChange}
          onDateChange={handleDateChange}
          onResetFilters={handleResetFilters}
        />
        <CourseStatusTabs
          value={filters.status}
          onChange={handleStatusChange}
          counts={countStatus}
        />

        {isLoading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ py: 6 }}
            spacing={2}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Đang tải danh sách lớp học...
            </Typography>
          </Stack>
        ) : null}

        {isError ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Thử lại
              </Button>
            }
          >
            Không thể tải danh sách lớp học. Vui lòng kiểm tra lại kết nối.
          </Alert>
        ) : null}

        {!isLoading && !isError ? (
          classRooms?.length === 0 ? (
            <Box
              sx={{
                py: 6,
                px: 3,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Không có lớp học phù hợp
              </Typography>
              <Typography variant="body2">
                Hãy thử điều chỉnh lại bộ lọc hoặc làm mới dữ liệu.
              </Typography>
            </Box>
          ) : (
            <ClassRoomGrid classRooms={classRooms} />
          )
        ) : null}
      </Stack>
    </PageContainer>
  );
}
