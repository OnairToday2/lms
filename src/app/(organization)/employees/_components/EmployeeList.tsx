"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PageContainer from "@/shared/ui/PageContainer";
import { useGetEmployeesQuery } from "@/modules/employees/operations/query";
import { useDeleteEmployeeMutation } from "@/modules/employees/operations/mutation";
import type { EmployeeDto } from "@/types/dto/employees";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications/useNotifications";
import { useQueryClient } from "@tanstack/react-query";

export default function EmployeeList() {
  const router = useRouter();
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);
  const [searchInput, setSearchInput] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState("all");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  React.useEffect(() => {
    setPage(0);
  }, [departmentFilter]);

  const { data: employeesResult, isLoading, error } = useGetEmployeesQuery({
    page,
    limit: rowsPerPage,
    search: debouncedSearch,
    departmentId: departmentFilter,
  });

  const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployeeMutation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<string | null>(null);
  const menuOpen = Boolean(anchorEl);

  const employees = employeesResult?.data || [];
  const totalCount = employeesResult?.total || 0;

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateEmployee = () => {
    router.push("/employees/create");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, employeeId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedEmployeeId(employeeId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployeeId(null);
  };

  const handleEdit = () => {
    if (selectedEmployeeId) {
      router.push(`/employees/${selectedEmployeeId}/edit`);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedEmployeeId) return;

    const confirmed = await dialogs.confirm(
      "Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác.",
      {
        title: "Xác nhận xóa",
        okText: "Xóa",
        cancelText: "Hủy",
        severity: "error",
      }
    );

    if (!confirmed) {
      handleMenuClose();
      return;
    }

    try {
      await deleteEmployee(selectedEmployeeId);

      await queryClient.invalidateQueries({ queryKey: ["employees"] });

      notifications.show("Xóa nhân viên thành công!", {
        severity: "success",
        autoHideDuration: 3000,
      });

      handleMenuClose();
    } catch (error) {
      console.error("Error deleting employee:", error);
      notifications.show(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa nhân viên",
        {
          severity: "error",
          autoHideDuration: 5000,
        }
      );
      handleMenuClose();
    }
  };

  const getDepartmentName = (employee: EmployeeDto) => {
    const dept = employee.employments.find(
      (emp) => emp.organization_units?.type === "department"
    );
    return dept?.organization_units?.name || "-";
  };

  const getBranchName = (employee: EmployeeDto) => {
    const branch = employee.employments.find(
      (emp) => emp.organization_units?.type === "branch"
    );
    return branch?.organization_units?.name || "-";
  };

  return (
    <PageContainer
      title="Danh sách nhân viên"
      breadcrumbs={[{ title: "Nhân viên", path: "/employees" }]}
    >
      <Box sx={{ py: 3 }}>
        <Card sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 3 }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ flex: 1 }}
            >
              <TextField
                placeholder="Tìm kiếm theo mã, tên, email..."
                size="small"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
            </Stack>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateEmployee}
            >
              Tạo nhân viên
            </Button>
          </Stack>

          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">
              Có lỗi xảy ra khi tải danh sách nhân viên
            </Alert>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã nhân viên</TableCell>
                      <TableCell>Họ và tên</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Chức danh</TableCell>
                      <TableCell>Vai trò</TableCell>
                      <TableCell>Chi nhánh</TableCell>
                      <TableCell>Phòng ban</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                          <Typography variant="body2" color="text.secondary">
                            Không tìm thấy nhân viên nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      employees.map((employee) => (
                        <TableRow
                          key={employee.id}
                          hover
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>{employee.employee_code}</TableCell>
                          <TableCell>
                            {employee.profiles?.full_name || "-"}
                          </TableCell>
                          <TableCell>{employee.profiles?.email || "-"}</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>Nhân viên</TableCell>
                          <TableCell>{getBranchName(employee)}</TableCell>
                          <TableCell>{getDepartmentName(employee)}</TableCell>
                          <TableCell>
                            <Chip
                              label="Hoạt động"
                              color="success"
                              size="small"
                              sx={{ minWidth: 100 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, employee.id)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[12, 25, 50, 100]}
                labelRowsPerPage="Số hàng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} của ${count}`
                }
              />
            </>
          )}

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Chỉnh sửa</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete} disabled={isDeleting}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Xóa</ListItemText>
            </MenuItem>
          </Menu>
        </Card>
      </Box>
    </PageContainer>
  );
}
