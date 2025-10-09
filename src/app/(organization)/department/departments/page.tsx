"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import { Add, Edit, Delete, FileUpload, Search } from "@mui/icons-material";
import { useDepartments, useDeleteDepartment, useBranches } from "@/modules/department/hooks/useDepartments";
import { DepartmentDialog } from "@/modules/department/components/DepartmentDialog";
import { ImportDepartmentDialog } from "@/modules/department/components/ImportDepartmentDialog";
import { Department } from "@/modules/department/types";
import useDebounce from "@/hooks/useDebounce";

const ORGANIZATION_ID = "d9163545-afbe-4178-b5d1-3b3c9cfcba80";

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [deleteError, setDeleteError] = useState<string>("");

  const debouncedSearch = useDebounce(search, 500);

  const { data: branches } = useBranches(ORGANIZATION_ID);
  const {
    data: departmentsData,
    isLoading,
    error,
  } = useDepartments(
    {
      search: debouncedSearch,
      organizationId: ORGANIZATION_ID,
      branchId: branchFilter || undefined,
    },
    page + 1,
    pageSize
  );

  const deleteMutation = useDeleteDepartment();

  const handleCreate = () => {
    setSelectedDepartment(null);
    setCreateDialogOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (department: Department) => {
    setSelectedDepartment(department);
    setDeleteError("");
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDepartment) return;

    try {
      await deleteMutation.mutateAsync(selectedDepartment.id);
      setDeleteDialogOpen(false);
      setSelectedDepartment(null);
    } catch (error: any) {
      setDeleteError(
        error.message || "Có lỗi xảy ra khi xóa phòng ban"
      );
    }
  };

  const handleImport = () => {
    setImportDialogOpen(true);
  };

  const getBranchName = (parentId: string | null) => {
    if (!parentId) return "Không thuộc chi nhánh";
    const branch = branches?.find(b => b.id === parentId);
    return branch?.name || "N/A";
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Tên phòng ban",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "parent_id",
      headerName: "Chi nhánh",
      width: 200,
      valueGetter: (value) => getBranchName(value),
    },
    {
      field: "created_at",
      headerName: "Ngày tạo",
      width: 180,
      valueFormatter: (value) => {
        if (!value) return "";
        return new Date(value).toLocaleString("vi-VN");
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Hành động",
      width: 100,
      getActions: (params: GridRowParams<Department>) => [
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Chỉnh sửa"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete />}
          label="Xóa"
          onClick={() => handleDeleteClick(params.row)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Quản lý Phòng ban
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FileUpload />}
            onClick={handleImport}
          >
            Import
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Tạo phòng ban
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          sx={{ flex: 1, maxWidth: 500 }}
          placeholder="Tìm kiếm theo tên phòng ban"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <IconButton edge="start" size="small">
                <Search />
              </IconButton>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Lọc theo chi nhánh</InputLabel>
          <Select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            label="Lọc theo chi nhánh"
          >
            <MenuItem value="">
              <em>Tất cả</em>
            </MenuItem>
            {branches?.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Có lỗi xảy ra khi tải danh sách phòng ban
        </Alert>
      )}

      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={departmentsData?.data || []}
          columns={columns}
          loading={isLoading}
          rowCount={departmentsData?.count || 0}
          paginationMode="server"
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </Box>

      <DepartmentDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        organizationId={ORGANIZATION_ID}
      />

      <DepartmentDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        department={selectedDepartment}
        organizationId={ORGANIZATION_ID}
      />

      <ImportDepartmentDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        organizationId={ORGANIZATION_ID}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa phòng ban{" "}
            <strong>{selectedDepartment?.name}</strong>?
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
