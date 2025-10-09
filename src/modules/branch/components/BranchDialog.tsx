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
import {
  useCreateBranch,
  useUpdateBranch,
  useCheckBranchName,
} from "../hooks/useBranches";
import { Branch, BranchFormData } from "../types";

interface BranchDialogProps {
  open: boolean;
  onClose: () => void;
  branch?: Branch | null;
  organizationId: string;
}

export function BranchDialog({
  open,
  onClose,
  branch,
  organizationId,
}: BranchDialogProps) {
  const isEditMode = !!branch;

  const [formData, setFormData] = useState<BranchFormData>({
    name: "",
    organization_id: organizationId,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BranchFormData, string>>
  >({});

  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();
  const checkNameMutation = useCheckBranchName();

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
        const nameExists = await checkNameMutation.mutateAsync({
          name: formData.name,
          organizationId: formData.organization_id,
          excludeId: branch?.id,
        });
        if (nameExists) {
          newErrors.name = "Tên chi nhánh đã tồn tại";
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
      if (isEditMode && branch) {
        await updateMutation.mutateAsync({
          id: branch.id,
          data: {
            name: formData.name,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          organization_id: formData.organization_id,
        });
      }
      onClose();
    } catch (error: any) {
      console.error("Failed to save branch:", error);
      setErrors({
        name: error.message || "Có lỗi xảy ra khi lưu chi nhánh",
      });
    }
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    checkNameMutation.isPending;

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

          {(createMutation.isError || updateMutation.isError) && (
            <Alert severity="error">
              {createMutation.error?.message ||
                updateMutation.error?.message ||
                "Có lỗi xảy ra khi lưu chi nhánh"}
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
