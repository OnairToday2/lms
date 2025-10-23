"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useImportBranchesMutation } from "../operations/mutation";
import type { BranchImportRow } from "@/types/dto/branches";
import useNotifications from "@/hooks/useNotifications/useNotifications";

interface ImportBranchDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  onSuccess?: () => void;
}

export function ImportBranchDialog({
  open,
  onClose,
  organizationId,
  onSuccess,
}: ImportBranchDialogProps) {
  const notifications = useNotifications();
  const [file, setFile] = useState<File | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const { mutateAsync: importBranches, isPending } = useImportBranchesMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setError(
        "Định dạng file không hợp lệ. Vui lòng chọn file .xlsx hoặc .csv"
      );
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
    setImportErrors([]);
    setImportSuccess(false);
  };

  const parseFile = async (file: File): Promise<BranchImportRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split("\n").filter((line) => line.trim());

          if (lines.length < 2) {
            reject(new Error("File phải có ít nhất 1 dòng dữ liệu"));
            return;
          }

          // Parse header to find name column
          const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
          const nameIndex = headers.findIndex(
            (h) => h === "Tên chi nhánh" || h === "name" || h === "Name"
          );

          if (nameIndex === -1) {
            reject(
              new Error(
                'File phải có cột "Tên chi nhánh" hoặc "name"'
              )
            );
            return;
          }

          // Parse data rows
          const rows: BranchImportRow[] = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
            if (values[nameIndex]) {
              rows.push({
                name: values[nameIndex],
              });
            }
          }

          resolve(rows);
        } catch {
          reject(
            new Error("Không thể đọc file. Vui lòng kiểm tra định dạng file.")
          );
        }
      };

      reader.onerror = () => {
        reject(new Error("Lỗi khi đọc file"));
      };

      reader.readAsText(file);
    });
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setError("");
      setImportErrors([]);
      setImportSuccess(false);

      // Parse file
      const rows = await parseFile(file);

      if (rows.length === 0) {
        setError("File không chứa dữ liệu hợp lệ");
        return;
      }

      // Import branches
      const result = await importBranches({
        branches: rows,
        organizationId,
      });

      if (result.success) {
        setImportSuccess(true);
        notifications.show(`Import thành công ${result.imported} chi nhánh!`, {
          severity: "success",
          autoHideDuration: 3000,
        });
        onSuccess?.();
        setTimeout(() => {
          onClose();
          handleReset();
        }, 2000);
      } else {
        setImportErrors(result.errors);
        notifications.show("Import thất bại. Vui lòng kiểm tra lỗi.", {
          severity: "error",
          autoHideDuration: 5000,
        });
      }
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi import");
      notifications.show(error.message || "Có lỗi xảy ra khi import", {
        severity: "error",
        autoHideDuration: 5000,
      });
    }
  };

  const handleReset = () => {
    setFile(null);
    setError("");
    setImportErrors([]);
    setImportSuccess(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Import chi nhánh</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Instructions */}
          <Alert severity="info">
            <Typography variant="body2">
              File import cần có cột <strong>"Tên chi nhánh"</strong> hoặc{" "}
              <strong>"name"</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Định dạng file hỗ trợ: .xlsx, .csv
            </Typography>
          </Alert>

          {/* File upload area */}
          <Box
            sx={{
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
            }}
            component="label"
          >
            <input
              type="file"
              hidden
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
            />
            <CloudUpload sx={{ fontSize: 48, color: "action.active", mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              Kéo & thả file hoặc <strong>chọn file</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hỗ trợ: .xlsx, .csv
            </Typography>
          </Box>

          {/* Selected file info */}
          {file && (
            <Alert severity="success">
              <Typography variant="body2">
                <strong>Đã chọn:</strong> {file.name} (
                {(file.size / 1024).toFixed(2)} KB)
              </Typography>
            </Alert>
          )}

          {/* Error message */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Import result */}
          {importSuccess && (
            <Alert severity="success">Import thành công!</Alert>
          )}

          {importErrors.length > 0 && (
            <Alert severity="error">
              <Typography variant="body2" gutterBottom>
                <strong>Import thất bại.</strong> Có {importErrors.length} lỗi:
              </Typography>
              <List dense>
                {importErrors.slice(0, 10).map((err, index) => (
                  <ListItem key={index} sx={{ py: 0 }}>
                    <ListItemText
                      primary={err}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                ))}
                {importErrors.length > 10 && (
                  <ListItem sx={{ py: 0 }}>
                    <ListItemText
                      primary={`... và ${importErrors.length - 10} lỗi khác`}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                    />
                  </ListItem>
                )}
              </List>
            </Alert>
          )}

          {/* Loading indicator */}
          {isPending && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          {importSuccess ? "Đóng" : "Huỷ"}
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!file || isPending || importSuccess}
          startIcon={isPending && <CircularProgress size={20} />}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
