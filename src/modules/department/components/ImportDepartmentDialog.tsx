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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useImportDepartments, useBranches } from "../hooks/useDepartments";
import { ImportDepartmentRow, ImportResult } from "../types";

interface ImportDepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
}

export function ImportDepartmentDialog({
  open,
  onClose,
  organizationId,
}: ImportDepartmentDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [defaultBranchId, setDefaultBranchId] = useState<string>("");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string>("");

  const importMutation = useImportDepartments();
  const { data: branches } = useBranches(organizationId);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.csv')) {
      setError(
        "Định dạng file không hợp lệ. Vui lòng chọn file .csv"
      );
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
    setImportResult(null);
  };

  const parseFile = async (file: File): Promise<ImportDepartmentRow[]> => {
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

          const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
          const nameIndex = headers.findIndex(
            (h) => h === "Tên phòng ban" || h === "name" || h === "Name"
          );
          const branchIndex = headers.findIndex(
            (h) => h === "Chi nhánh" || h === "branch" || h === "Branch"
          );

          if (nameIndex === -1) {
            reject(
              new Error(
                'File phải có cột "Tên phòng ban" hoặc "name"'
              )
            );
            return;
          }

          const rows: ImportDepartmentRow[] = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
            if (values[nameIndex]) {
              rows.push({
                name: values[nameIndex],
                branchName: branchIndex !== -1 ? values[branchIndex] : undefined,
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
      setImportResult(null);

      const rows = await parseFile(file);

      if (rows.length === 0) {
        setError("File không chứa dữ liệu hợp lệ");
        return;
      }

      const result = await importMutation.mutateAsync({
        rows,
        organizationId,
        defaultBranchId: defaultBranchId || undefined,
      });

      setImportResult(result);

      if (result.success) {
        setTimeout(() => {
          onClose();
          handleReset();
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi import");
    }
  };

  const handleReset = () => {
    setFile(null);
    setDefaultBranchId("");
    setError("");
    setImportResult(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Import phòng ban</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Alert severity="info">
            <Typography variant="body2">
              File import cần có cột <strong>&quot;Tên phòng ban&quot;</strong> hoặc{" "}
              <strong>&quot;name&quot;</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Có thể có cột <strong>&quot;Chi nhánh&quot;</strong> hoặc{" "}
              <strong>&quot;branch&quot;</strong> để chỉ định chi nhánh
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Định dạng file hỗ trợ: .csv
            </Typography>
          </Alert>

          <FormControl fullWidth>
            <InputLabel>Chi nhánh mặc định (tùy chọn)</InputLabel>
            <Select
              value={defaultBranchId}
              onChange={(e) => setDefaultBranchId(e.target.value)}
              label="Chi nhánh mặc định (tùy chọn)"
            >
              <MenuItem value="">
                <em>Không chọn</em>
              </MenuItem>
              {branches?.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
              accept=".csv"
              onChange={handleFileChange}
            />
            <CloudUpload sx={{ fontSize: 48, color: "action.active", mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              Kéo & thả file hoặc <strong>chọn file</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hỗ trợ: .csv
            </Typography>
          </Box>

          {file && (
            <Alert severity="success">
              <Typography variant="body2">
                <strong>Đã chọn:</strong> {file.name} (
                {(file.size / 1024).toFixed(2)} KB)
              </Typography>
            </Alert>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {importResult && (
            <>
              {importResult.success ? (
                <Alert severity="success">
                  Đã import thành công {importResult.created} phòng ban
                </Alert>
              ) : (
                <Alert severity="error">
                  <Typography variant="body2" gutterBottom>
                    <strong>Import thất bại.</strong> Có {importResult.errors.length}{" "}
                    lỗi:
                  </Typography>
                  <List dense>
                    {importResult.errors.slice(0, 10).map((err, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemText
                          primary={`Dòng ${err.row}: ${err.message}`}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    ))}
                    {importResult.errors.length > 10 && (
                      <ListItem sx={{ py: 0 }}>
                        <ListItemText
                          primary={`... và ${importResult.errors.length - 10} lỗi khác`}
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
            </>
          )}

          {importMutation.isPending && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={importMutation.isPending}>
          {importResult?.success ? "Đóng" : "Huỷ"}
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!file || importMutation.isPending || !!importResult?.success}
          startIcon={importMutation.isPending && <CircularProgress size={20} />}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
