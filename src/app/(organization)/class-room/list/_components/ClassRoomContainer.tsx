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
  ClassRoomFilters,
  ClassRoomRuntimeStatus,
} from "../types/types";
import CourseFiltersBar from "./ClassRoomCourseFilters";
import CourseStatusTabs from "./ClassRoomStatusTabs";
import {
  GetClassRoomsQueryInput,
  GetClassRoomStatusCountsInput,
  useCountStatusClassRoomsQuery,
  useGetClassRoomsQuery,
} from "@/modules/class-room-management/operations/query";
import ClassRoomGrid from "./ClassRoomGrid";
import { Pagination } from "@/shared/ui/Pagination";
import { useAuthStore } from "@/modules/auth/store/AuthProvider";

const initialFilters: ClassRoomFilters = {
  search: "",
  status: ClassRoomRuntimeStatus.All,
  startDate: null,
  endDate: null,
};

const PAGE_SIZE = 9;

export default function ClassRoomContainer() {
  const [filters, setFilters] = useState<ClassRoomFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const ownerId = useAuthStore((state) => state.data?.id);

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
      page,
      limit: PAGE_SIZE,
      ownerId,
    };
  }, [
    filters.search,
    filters.startDate,
    filters.endDate,
    filters.status,
    page,
    ownerId,
  ]);

  const { data: classRoomsResult, isLoading, isError, refetch } =
    useGetClassRoomsQuery(queryInput);

  const classRooms = classRoomsResult?.items ?? [];
  const totalClassRooms = classRoomsResult?.total ?? 0;
  const countQueryInput = useMemo<GetClassRoomStatusCountsInput>(
    () => ({
      ownerId,
      q: queryInput.q,
      from: queryInput.from,
      to: queryInput.to,
    }),
    [ownerId, queryInput.q, queryInput.from, queryInput.to],
  );
  const { data: countStatus } = useCountStatusClassRoomsQuery(countQueryInput);
  const isFetchingClassRooms = !ownerId || isLoading;


  const handleSearchChange = (value: string) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    value: string | null,
  ) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      search: "",
      startDate: null,
      endDate: null,
    }));
  };

  const handleStatusChange = (status: ClassRoomRuntimeStatus) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      status,
    }));
  };

  const handlePaginationChange = (nextPage: number) => {
    setPage(nextPage);
  };


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

        {isFetchingClassRooms ? (
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

        {isError && ownerId ? (
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

        {!isFetchingClassRooms && !isError ? (
          classRooms.length === 0 ? (
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
      {totalClassRooms > 0 ? (
        <Box mt={2}>
          <Pagination
            onChange={handlePaginationChange}
            total={totalClassRooms}
            take={PAGE_SIZE}
            value={page}
            name="Lớp học"
          />
        </Box>
      ) : null}
    </PageContainer>
  );
}
