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
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import { Add, Edit, Delete, FileUpload, Search } from "@mui/icons-material";
import { useBranches, useDeleteBranch } from "@/modules/branch/hooks/useBranches";
import { BranchDialog } from "@/modules/branch/components/BranchDialog";
import { ImportBranchDialog } from "@/modules/branch/components/ImportBranchDialog";
import { Branch } from "@/modules/branch/types";
import useDebounce from "@/hooks/useDebounce";

// TODO: Get organization ID from user context/auth
const ORGANIZATION_ID = "d9163545-afbe-4178-b5d1-3b3c9cfcba80";

export default function BranchesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [deleteError, setDeleteError] = useState<string>("");

  const debouncedSearch = useDebounce(search, 500);

  // Fetch branches
  const {
    data: branchesData,
    isLoading,
    error,
  } = useBranches(
    {
      search: debouncedSearch,
      organizationId: ORGANIZATION_ID,
    },
    page + 1,
    pageSize
  );

  const deleteMutation = useDeleteBranch();

  // Handle create
  const handleCreate = () => {
    setSelectedBranch(null);
    setCreateDialogOpen(true);
  };

  // Handle edit
  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setEditDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setDeleteError("");
    setDeleteDialogOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedBranch) return;

    try {
      await deleteMutation.mutateAsync(selectedBranch.id);
      setDeleteDialogOpen(false);
      setSelectedBranch(null);
    } catch (error: any) {
      setDeleteError(
        error.message || "Có lỗi xảy ra khi xóa chi nhánh"
      );
    }
  };

  // Handle import
  const handleImport = () => {
    setImportDialogOpen(true);
  };

  // Define columns
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Tên chi nhánh",
      flex: 1,
      minWidth: 200,
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
      getActions: (params: GridRowParams<Branch>) => [
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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Quản lý Chi nhánh
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
            Tạo chi nhánh
          </Button>
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3, maxWidth: 500 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm theo tên chi nhánh"
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
      </Box>

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Có lỗi xảy ra khi tải danh sách chi nhánh
        </Alert>
      )}

      {/* Data Grid */}
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={branchesData?.data || []}
          columns={columns}
          loading={isLoading}
          rowCount={branchesData?.count || 0}
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

      {/* Create Dialog */}
      <BranchDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        organizationId={ORGANIZATION_ID}
      />

      {/* Edit Dialog */}
      <BranchDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        branch={selectedBranch}
        organizationId={ORGANIZATION_ID}
      />

      {/* Import Dialog */}
      <ImportBranchDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        organizationId={ORGANIZATION_ID}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa chi nhánh{" "}
            <strong>{selectedBranch?.name}</strong>?
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
