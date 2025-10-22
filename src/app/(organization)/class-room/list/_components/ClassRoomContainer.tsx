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
  ClassRoomStatus,
} from "../types/types";
import CourseFiltersBar from "./ClassRoomCourseFilters";
import CourseStatusTabs from "./ClassRoomStatusTabs";
import {
  GetClassRoomsQueryInput,
  GetClassRoomStatusCountsInput,
  useCountStatusClassRoomsQuery,
  useGetClassRoomsQuery,
} from "@/modules/class-room-management/operations/query";
import { Pagination } from "@/shared/ui/Pagination";
import { useAuthStore } from "@/modules/auth/store/AuthProvider";
import ClassRoomListTable from "./list-view/ClassRoomListTable";
import ClassRoomListFilters from "./ClassRoomCourseFilters";

const initialFilters: ClassRoomFilters = {
  search: "",
  runtimeStatus: ClassRoomRuntimeStatus.All,
  startDate: null,
  endDate: null,
  status: ClassRoomStatus.All,
};

const PAGE_SIZE = 8;

export default function ClassRoomContainer() {
  const [filters, setFilters] = useState<ClassRoomFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const org_id = "6f0e0c9c-94a5-43cd-9b4f-04b2d30f082e";

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
      runtimeStatus: filters.runtimeStatus,
      status: filters.status,
      page,
      limit: PAGE_SIZE,
      org_id,
    };
  }, [
    filters.search,
    filters.startDate,
    filters.endDate,
    filters.runtimeStatus,
    filters.status,
    page,
  ]);

  const { data: classRoomsResult, isLoading, isError, refetch } =
    useGetClassRoomsQuery(queryInput);

  const classRooms = classRoomsResult?.items ?? [];
  const totalClassRooms = classRoomsResult?.total ?? 0;
  // const countQueryInput = useMemo<GetClassRoomStatusCountsInput>(
  //   () => ({
  //     q: queryInput.q,
  //     from: queryInput.from,
  //     to: queryInput.to,
  //   }),
  //   [queryInput.q, queryInput.from, queryInput.to],
  // );
  // const { data: countStatus } = useCountStatusClassRoomsQuery(countQueryInput);


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

  const handleRuntimeStatusChange = (runtimeStatus: ClassRoomRuntimeStatus) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      runtimeStatus,
    }));
  }

  const handleStausChange = (status: ClassRoomStatus) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      status,
    }));
  }

  // const handleStatusChange = (status: ClassRoomRuntimeStatus) => {
  //   setPage(1);
  //   setFilters((prev) => ({
  //     ...prev,
  //     status,
  //   }));
  // };

  const handlePaginationChange = (nextPage: number) => {
    setPage(nextPage);
  };

  console.log("classRooms", classRooms);



  return (
    <Box
      px={2}
      py={2.5}
      bgcolor={"#fff"}
      borderRadius={2}
    >
      <Stack spacing={3}>
        <ClassRoomListFilters
          search={filters.search}
          startDate={filters.startDate}
          endDate={filters.endDate}
          runtimeStatus={filters.runtimeStatus}
          status={filters.status}
          onSearchChange={handleSearchChange}
          onDateChange={handleDateChange}
          onRuntimeStatusChange={handleRuntimeStatusChange}
          onStausChange={handleStausChange}
        />
        {/* <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <Box flex={1} sx={{ minWidth: 0 }}>
                <CourseStatusTabs
                  value={filters.status}
                  onChange={handleStatusChange}
                  counts={countStatus}
                />
              </Box>
        </Stack> */}

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
            <ClassRoomListTable
              classRooms={classRooms}
              page={queryInput.page ?? 1}
              pageSize={queryInput.limit ?? PAGE_SIZE}
            />
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
    </Box>
  );
}
