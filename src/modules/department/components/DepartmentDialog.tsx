"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  useCreateDepartment,
  useUpdateDepartment,
  useCheckDepartmentName,
  useBranches,
} from "../hooks/useDepartments";
import { Department, DepartmentFormData } from "../types";

interface DepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  department?: Department | null;
  organizationId: string;
}

export function DepartmentDialog({
  open,
  onClose,
  department,
  organizationId,
}: DepartmentDialogProps) {
  const isEditMode = !!department;

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    organization_id: organizationId,
    parent_id: null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof DepartmentFormData, string>>
  >({});

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const checkNameMutation = useCheckDepartmentName();
  const { data: branches, isLoading: branchesLoading } = useBranches(organizationId);

  useEffect(() => {
    if (open) {
      if (department) {
        setFormData({
          name: department.name,
          organization_id: department.organization_id,
          parent_id: department.parent_id,
        });
      } else {
        setFormData({
          name: "",
          organization_id: organizationId,
          parent_id: null,
        });
      }
      setErrors({});
    }
  }, [open, department, organizationId]);

  const handleInputChange = (field: keyof DepartmentFormData, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = async () => {
    const newErrors: Partial<Record<keyof DepartmentFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên phòng ban không được để trống";
    } else if (formData.name.length > 100) {
      newErrors.name = "Tên phòng ban không được vượt quá 100 ký tự";
    } else {
      try {
        const nameExists = await checkNameMutation.mutateAsync({
          name: formData.name,
          organizationId: formData.organization_id,
          branchId: formData.parent_id,
          excludeId: department?.id,
        });
        if (nameExists) {
          newErrors.name = "Tên phòng ban đã tồn tại trong chi nhánh này";
        }
      } catch (error) {
        console.error("Failed to check name:", error);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      if (isEditMode && department) {
        await updateMutation.mutateAsync({
          id: department.id,
          data: {
            name: formData.name,
            parent_id: formData.parent_id,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          organization_id: formData.organization_id,
          parent_id: formData.parent_id,
          type: "department",
        });
      }
      onClose();
    } catch (error: any) {
      console.error("Failed to save department:", error);
      setErrors({
        name: error.message || "Có lỗi xảy ra khi lưu phòng ban",
      });
    }
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    checkNameMutation.isPending ||
    branchesLoading;

  const isFormValid = formData.name.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Chỉnh sửa phòng ban" : "Tạo phòng ban"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Tên phòng ban"
            required
            fullWidth
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isLoading}
            inputProps={{ maxLength: 100 }}
          />

          <FormControl fullWidth>
            <InputLabel>Chi nhánh</InputLabel>
            <Select
              value={formData.parent_id || ""}
              onChange={(e) => handleInputChange("parent_id", e.target.value || null)}
              disabled={isLoading}
              label="Chi nhánh"
            >
              <MenuItem value="">
                <em>Không thuộc chi nhánh nào</em>
              </MenuItem>
              {branches?.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(createMutation.isError || updateMutation.isError) && (
            <Alert severity="error">
              {createMutation.error?.message ||
                updateMutation.error?.message ||
                "Có lỗi xảy ra khi lưu phòng ban"}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Huỷ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid || isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isEditMode ? "Lưu" : "Tạo mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
