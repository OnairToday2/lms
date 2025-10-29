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
} from "@mui/material";
import { useCreateBranchMutation, useUpdateBranchMutation } from "../operations/mutation";
import { branchRepository } from "@/repository/branch";
import type { BranchDto } from "@/types/dto/branches";
import useNotifications from "@/hooks/useNotifications/useNotifications";

interface BranchFormData {
  name: string;
  organization_id: string;
}

interface BranchDialogProps {
  open: boolean;
  onClose: () => void;
  branch?: BranchDto | null;
  organizationId: string;
  onSuccess?: () => void;
}

export function BranchDialog({
  open,
  onClose,
  branch,
  organizationId,
  onSuccess,
}: BranchDialogProps) {
  const isEditMode = !!branch;
  const notifications = useNotifications();

  const [formData, setFormData] = useState<BranchFormData>({
    name: "",
    organization_id: organizationId,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BranchFormData, string>>
  >({});
  const [isCheckingName, setIsCheckingName] = useState(false);

  const { mutateAsync: createBranch, isPending: isCreating } = useCreateBranchMutation();
  const { mutateAsync: updateBranch, isPending: isUpdating } = useUpdateBranchMutation();

  useEffect(() => {
    if (open) {
      if (branch) {
        setFormData({
          name: branch.name,
          organization_id: branch.organization_id,
        });
      } else {
        setFormData({
          name: "",
          organization_id: organizationId,
        });
      }
      setErrors({});
    }
  }, [open, branch, organizationId]);

  const handleInputChange = (field: keyof BranchFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = async () => {
    const newErrors: Partial<Record<keyof BranchFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên chi nhánh không được để trống";
    } else if (formData.name.length > 100) {
      newErrors.name = "Tên chi nhánh không được vượt quá 100 ký tự";
    } else {
      try {
        setIsCheckingName(true);
        const nameExists = await branchRepository.checkNameExists(
          formData.name,
          formData.organization_id,
          branch?.id
        );
        if (nameExists) {
          newErrors.name = "Tên chi nhánh đã tồn tại";
        }
      } catch (error) {
        console.error("Failed to check name:", error);
      } finally {
        setIsCheckingName(false);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      if (isEditMode && branch) {
        await updateBranch({
          id: branch.id,
          name: formData.name,
        });
        notifications.show("Cập nhật chi nhánh thành công!", {
          severity: "success",
          autoHideDuration: 3000,
        });
      } else {
        await createBranch({
          name: formData.name,
          organization_id: formData.organization_id,
        });
        notifications.show("Tạo chi nhánh thành công!", {
          severity: "success",
          autoHideDuration: 3000,
        });
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Failed to save branch:", error);
      notifications.show(
        error.message || "Có lỗi xảy ra khi lưu chi nhánh",
        {
          severity: "error",
          autoHideDuration: 5000,
        }
      );
    }
  };

  const isLoading = isCreating || isUpdating || isCheckingName;
  const isFormValid = formData.name.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Chỉnh sửa chi nhánh" : "Tạo chi nhánh"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Tên chi nhánh"
            required
            fullWidth
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isLoading}
            inputProps={{ maxLength: 100 }}
          />
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
