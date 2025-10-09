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
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PageContainer from "@/shared/ui/PageContainer";
import { useGetEmployeesQuery } from "@/modules/employees/operations/query";
import { useDeleteEmployeeMutation } from "@/modules/employees/operations/mutation";
import type { EmployeeListItem } from "@/repository/employees";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications/useNotifications";
import { useQueryClient } from "@tanstack/react-query";

export default function EmployeeList() {
  const router = useRouter();
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  // Fetch employees data
  const { data: employees, isLoading, error } = useGetEmployeesQuery();

  // Delete mutation
  const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployeeMutation();

  // State for filters and pagination
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [departmentFilter, setDepartmentFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);

  // State for dropdown menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<string | null>(null);
  const menuOpen = Boolean(anchorEl);

  // Filter employees based on search and filters
  const filteredEmployees = React.useMemo(() => {
    if (!employees) return [];

    return employees.filter((employee) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        employee.employee_code.toLowerCase().includes(searchLower) ||
        employee.profiles?.full_name.toLowerCase().includes(searchLower) ||
        employee.profiles?.email.toLowerCase().includes(searchLower);

      // Role filter (placeholder - you'll need to add role to your data)
      const matchesRole = roleFilter === "all";

      // Department filter
      const matchesDepartment =
        departmentFilter === "all" ||
        employee.employments.some(
          (emp) => emp.organization_units?.id === departmentFilter
        );

      // Status filter (placeholder - you'll need to add status to your data)
      const matchesStatus = statusFilter === "all";

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  }, [employees, searchQuery, roleFilter, departmentFilter, statusFilter]);

  // Paginated employees
  const paginatedEmployees = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredEmployees, page, rowsPerPage]);

  // Get unique departments for filter
  const departments = React.useMemo(() => {
    if (!employees) return [];
    const deptSet = new Set<string>();
    employees.forEach((emp) => {
      emp.employments.forEach((employment) => {
        if (employment.organization_units) {
          deptSet.add(
            JSON.stringify({
              id: employment.organization_units.id,
              name: employment.organization_units.name,
            })
          );
        }
      });
    });
    return Array.from(deptSet).map((str) => JSON.parse(str));
  }, [employees]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const handleViewDetails = () => {
    if (selectedEmployeeId) {
      router.push(`/employees/${selectedEmployeeId}`);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedEmployeeId) return;

    // Show confirmation dialog
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

      // Invalidate and refetch the employees query
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

  // Helper function to get department/branch names
  const getOrganizationUnits = (employee: EmployeeListItem) => {
    const units = employee.employments
      .map((emp) => emp.organization_units?.name)
      .filter(Boolean);
    return units.length > 0 ? units.join(", ") : "-";
  };

  // Helper function to get department name
  const getDepartmentName = (employee: EmployeeListItem) => {
    const dept = employee.employments.find(
      (emp) => emp.organization_units?.type === "department"
    );
    return dept?.organization_units?.name || "-";
  };

  // Helper function to get branch name
  const getBranchName = (employee: EmployeeListItem) => {
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
          {/* Header with filters and actions */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 3 }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            {/* Left side - Search and filters */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ flex: 1 }}
            >
              <TextField
                placeholder=""
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />

              <Select
                size="small"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                displayEmpty
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">Vai trò</MenuItem>
                <MenuItem value="employee">Nhân viên</MenuItem>
                <MenuItem value="manager">Quản lý</MenuItem>
              </Select>

              <Select
                size="small"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                displayEmpty
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">Phòng ban</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            {/* Right side - Status and actions */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Trạng thái: Tất cả
              </Typography>

              <IconButton size="small">
                <FileDownloadOutlinedIcon />
              </IconButton>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateEmployee}
              >
                Tạo nhân viên
              </Button>
            </Stack>
          </Stack>

          {/* Table */}
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
                    {paginatedEmployees.map((employee) => (
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                component="div"
                count={filteredEmployees.length}
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

          {/* Actions Menu */}
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
            <MenuItem onClick={handleViewDetails}>
              <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Xem chi tiết</ListItemText>
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
