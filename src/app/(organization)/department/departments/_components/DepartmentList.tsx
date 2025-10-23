"use client";

import * as React from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
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
  MenuItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PageContainer from "@/shared/ui/PageContainer";
import { useGetDepartmentsQuery, useGetBranchesForDepartmentQuery } from "@/modules/department/operations/query";
import { useDeleteDepartmentMutation } from "@/modules/department/operations/mutation";
import type { DepartmentDto } from "@/types/dto/departments";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications/useNotifications";
import { useQueryClient } from "@tanstack/react-query";
import { DepartmentDialog } from "@/modules/department/components/DepartmentDialog";
import { ImportDepartmentDialog } from "@/modules/department/components/ImportDepartmentDialog";
import { useOrganizationId } from "@/hooks/useOrganizationId";

export default function DepartmentList() {
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const { organizationId, isLoading: isLoadingOrgId } = useOrganizationId();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);
  const [searchInput, setSearchInput] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [branchFilter, setBranchFilter] = React.useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState<DepartmentDto | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  React.useEffect(() => {
    setPage(0);
  }, [branchFilter]);

  const { data: branches } = useGetBranchesForDepartmentQuery(organizationId!, {
    enabled: !!organizationId,
  });

  const {
    data: departmentsResult,
    isLoading,
    error,
  } = useGetDepartmentsQuery({
    page,
    limit: rowsPerPage,
    search: debouncedSearch,
    organizationId: organizationId!,
    branchId: branchFilter !== "all" ? branchFilter : undefined,
  }, {
    enabled: !!organizationId,
  });

  const { mutateAsync: deleteDepartment, isPending: isDeleting } = useDeleteDepartmentMutation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = React.useState<string | null>(null);
  const menuOpen = Boolean(anchorEl);

  const departments = departmentsResult?.data || [];
  const totalCount = departmentsResult?.total || 0;

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateDepartment = () => {
    setSelectedDepartment(null);
    setCreateDialogOpen(true);
  };

  const handleImportDepartments = () => {
    setImportDialogOpen(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, department: DepartmentDto) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedDepartmentId(department.id);
    setSelectedDepartment(department);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDepartmentId(null);
  };

  const handleEdit = () => {
    if (selectedDepartment) {
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedDepartmentId) return;

    const confirmed = await dialogs.confirm(
      "Bạn có chắc chắn muốn xóa phòng ban này không? Hành động này không thể hoàn tác.",
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
      await deleteDepartment(selectedDepartmentId);

      await queryClient.invalidateQueries({ queryKey: ["departments"] });

      notifications.show("Xóa phòng ban thành công!", {
        severity: "success",
        autoHideDuration: 3000,
      });

      handleMenuClose();
    } catch (error) {
      console.error("Error deleting department:", error);
      notifications.show(
        error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa phòng ban",
        {
          severity: "error",
          autoHideDuration: 5000,
        }
      );
      handleMenuClose();
    }
  };

  const getBranchName = (department: DepartmentDto) => {
    if (!department.parent_id) return "Không thuộc chi nhánh";
    const branch = branches?.find((b) => b.id === department.parent_id);
    return branch?.name || "N/A";
  };

  const handleDialogClose = () => {
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setImportDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["departments"] });
    handleDialogClose();
  };

  return (
    <PageContainer
      title="Quản lý Phòng ban"
      breadcrumbs={[{ title: "Phòng ban", path: "/department/departments" }]}
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
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ flex: 1 }}>
              <TextField
                placeholder="Tìm kiếm..."
                size="small"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 300 }}
              />

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Lọc theo chi nhánh</InputLabel>
                <Select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  label="Lọc theo chi nhánh"
                >
                  <MenuItem value="all">
                    <em>Tất cả</em>
                  </MenuItem>
                  {branches?.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<FileUploadIcon />}
                onClick={handleImportDepartments}
              >
                Import
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateDepartment}
              >
                Tạo phòng ban
              </Button>
            </Stack>
          </Stack>

          {(isLoading || isLoadingOrgId) ? (
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
            <Alert severity="error">Có lỗi xảy ra khi tải danh sách phòng ban</Alert>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên phòng ban</TableCell>
                      <TableCell>Chi nhánh</TableCell>
                      <TableCell>Ngày tạo</TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                          <Typography variant="body2" color="text.secondary">
                            Không tìm thấy phòng ban nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      departments.map((department) => (
                        <TableRow key={department.id} hover sx={{ cursor: "pointer" }}>
                          <TableCell>{department.name}</TableCell>
                          <TableCell>{getBranchName(department)}</TableCell>
                          <TableCell>
                            {new Date(department.created_at).toLocaleString("vi-VN")}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, department)}
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
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
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
              <ListItemText>Chỉnh sửa</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete} disabled={isDeleting}>
              <ListItemText>Xóa</ListItemText>
            </MenuItem>
          </Menu>
        </Card>
      </Box>

      {organizationId && (
        <>
          <DepartmentDialog
            open={createDialogOpen}
            onClose={handleDialogClose}
            organizationId={organizationId}
            onSuccess={handleSuccess}
          />

          <DepartmentDialog
            open={editDialogOpen}
            onClose={handleDialogClose}
            department={selectedDepartment}
            organizationId={organizationId}
            onSuccess={handleSuccess}
          />

          <ImportDepartmentDialog
            open={importDialogOpen}
            onClose={handleDialogClose}
            organizationId={organizationId}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </PageContainer>
  );
}
