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
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "../operations/mutation";
import { useGetBranchesForDepartmentQuery } from "../operations/query";
import type { DepartmentDto } from "@/types/dto/departments";
import { departmentRepository } from "@/repository";
import useNotifications from "@/hooks/useNotifications/useNotifications";

interface DepartmentFormData {
  name: string;
  organization_id: string;
  parent_id: string | null;
}

interface DepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  department?: DepartmentDto | null;
  organizationId: string;
  onSuccess?: () => void;
}

export function DepartmentDialog({
  open,
  onClose,
  department,
  organizationId,
  onSuccess,
}: DepartmentDialogProps) {
  const isEditMode = !!department;
  const notifications = useNotifications();

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    organization_id: organizationId,
    parent_id: null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof DepartmentFormData, string>>
  >({});

  const { mutateAsync: createDepartment, isPending: isCreating } =
    useCreateDepartmentMutation();
  const { mutateAsync: updateDepartment, isPending: isUpdating } =
    useUpdateDepartmentMutation();
  const { data: branchesData, isLoading: branchesLoading } =
    useGetBranchesForDepartmentQuery(organizationId);

  const branches = branchesData?.data || [];

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
        const nameExists = await departmentRepository.checkNameExists(
          formData.name,
          formData.organization_id,
          formData.parent_id,
          department?.id
        );
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
        await updateDepartment({
          id: department.id,
          name: formData.name,
          parent_id: formData.parent_id || undefined,
        });
        notifications.show("Cập nhật phòng ban thành công!", {
          severity: "success",
        });
      } else {
        await createDepartment({
          name: formData.name,
          organization_id: formData.organization_id,
          parent_id: formData.parent_id || undefined,
        });
        notifications.show("Tạo phòng ban thành công!", {
          severity: "success",
        });
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Failed to save department:", error);
      notifications.show(
        error.message || "Có lỗi xảy ra khi lưu phòng ban",
        { severity: "error" }
      );
      setErrors({
        name: error.message || "Có lỗi xảy ra khi lưu phòng ban",
      });
    }
  };

  const isLoading = isCreating || isUpdating || branchesLoading;

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
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
