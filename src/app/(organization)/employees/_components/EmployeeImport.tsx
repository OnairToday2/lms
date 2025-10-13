"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  Typography,
  Alert,
  Stack,
  IconButton,
  LinearProgress,
  AlertTitle,
  Chip,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DescriptionIcon from "@mui/icons-material/Description";
import useNotifications from "@/hooks/useNotifications/useNotifications";
import {
  validateEmployeeFile,
  importEmployeesAction,
  type ValidationResult,
  type ImportResult,
} from "@/app/actions/employees";
import { DEFAULT_TEMPLATE_STRUCTURE, type TemplateColumn } from "@/utils/employees/template-parser";

/**
 * Create dynamic DataGrid columns based on template structure
 * Errors are displayed inline in the respective columns
 */
function createDynamicColumns(templateColumns: TemplateColumn[]): GridColDef[] {
  const columns: GridColDef[] = [];

  // Add columns from template
  templateColumns.forEach((templateCol) => {
    columns.push({
      field: templateCol.fieldKey,
      headerName: templateCol.fieldName + (templateCol.required ? " *" : ""),
      width: templateCol.width || 150,
      flex: templateCol.fieldKey === "email" ? 1 : undefined,
      minWidth: templateCol.width || 150,
      renderCell: (params: GridRenderCellParams) => {
        const rowData = params.row;
        const fieldValue = rowData[templateCol.fieldKey];
        const fieldError = rowData.fieldErrors?.[templateCol.fieldKey];
        const hasError = !!fieldError;

        // If there's an error for this field, display the error
        if (hasError) {
          return (
            <Tooltip title={fieldError} arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  width: "100%",
                  height: "100%",
                  bgcolor: "error.50",
                  borderRadius: 0.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "error.main",
                    fontWeight: "medium",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fieldError}
                </Typography>
              </Box>
            </Tooltip>
          );
        }

        // No error - display the value normally
        const displayValue = fieldValue || "--";
        const isEmpty = !fieldValue || fieldValue === "";

        return (
          <Tooltip title={fieldError} arrow>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                width: "100%",
                height: "100%",
                bgcolor: "error.50",
                borderRadius: 0.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isEmpty ? "text.secondary" : "text.primary",
                  fontStyle: isEmpty ? "italic" : "normal",
                  fontWeight: "medium",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayValue}
              </Typography>
            </Box>
          </Tooltip>
        );
      },
    });
  });

  return columns;
}

const EmployeeImport = () => {
  const router = useRouter();
  const notifications = useNotifications();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [validationResult, setValidationResult] = React.useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = React.useState<ImportResult | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!validTypes.includes(selectedFile.type) &&
      !selectedFile.name.endsWith(".csv") &&
      !selectedFile.name.endsWith(".xlsx")) {
      notifications.show("Chỉ hỗ trợ file .csv hoặc .xlsx", {
        severity: "error",
        autoHideDuration: 5000,
      });
      return;
    }

    // Validate file size (max 4MB)
    const maxSize = 4 * 1024 * 1024; // 4MB in bytes
    if (selectedFile.size > maxSize) {
      notifications.show("Kích thước file không được vượt quá 4MB", {
        severity: "error",
        autoHideDuration: 5000,
      });
      return;
    }

    setFile(selectedFile);
    validateFile(selectedFile);
  };

  const validateFile = async (file: File) => {
    setIsProcessing(true);
    setValidationResult(null);
    setImportResult(null);

    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", file);

      // Send the raw file to server for parsing and validation
      const validation = await validateEmployeeFile(formData);
      setValidationResult(validation);

      if (validation.invalidCount === 0) {
        notifications.show("File đã được tải lên và xác thực thành công!", {
          severity: "success",
          autoHideDuration: 3000,
        });
      } else {
        notifications.show(
          `Phát hiện ${validation.invalidCount} lỗi trong ${validation.totalCount} bản ghi`,
          {
            severity: "warning",
            autoHideDuration: 5000,
          },
        );
      }
    } catch (error) {
      console.error("Error validating file:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi xác thực file";
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 5000,
      });
      // Clear file on error
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setValidationResult(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    if (!validationResult || validationResult.invalidCount > 0) {
      notifications.show("Vui lòng sửa các lỗi trước khi import", {
        severity: "error",
        autoHideDuration: 5000,
      });
      return;
    }

    if (validationResult.validRecords.length === 0) {
      notifications.show("Không có bản ghi hợp lệ để import", {
        severity: "error",
        autoHideDuration: 5000,
      });
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      // Call the import server action
      const result = await importEmployeesAction(validationResult.validRecords);
      setImportResult(result);

      if (result.failedCount === 0) {
        notifications.show(
          `Import thành công ${result.successCount} nhân viên!`,
          {
            severity: "success",
            autoHideDuration: 3000,
          },
        );

        // Redirect to employees list after successful import
        setTimeout(() => {
          router.push("/employees");
        }, 2000);
      } else {
        notifications.show(
          `Import hoàn tất: ${result.successCount} thành công, ${result.failedCount} thất bại`,
          {
            severity: "warning",
            autoHideDuration: 5000,
          },
        );
      }
    } catch (error) {
      console.error("Error importing employees:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi import nhân viên";
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 5000,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const totalCount = validationResult?.totalCount || 0;
  const validCount = validationResult?.validCount || 0;
  const errorCount = validationResult?.invalidCount || 0;

  return (
    <Box sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* File Upload Area */}
        <Card>
          <Stack spacing={2}>
            <Box
              sx={{
                p: 4,
                border: "2px dashed",
                borderColor: isDragging ? "primary.main" : "divider",
                borderRadius: 2,
                bgcolor: isDragging ? "action.hover" : "background.paper",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Tải lên
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Kéo thả file vào đây hoặc chọn file
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hỗ trợ .xlsx, .csv (tối đa 4MB)
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />
            </Box>

            {isProcessing && (
              <Box sx={{ px: 4, pb: 2 }}>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Đang xử lý file...
                </Typography>
              </Box>
            )}

            {/* Uploaded File Display */}
            {file && !isProcessing && (
              <Box
                sx={{
                  margin: "0 auto !important",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "50%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DescriptionIcon sx={{ color: "success.main" }} />
                  <Typography variant="body2">{file.name}</Typography>
                </Box>
                <IconButton size="small" onClick={handleRemoveFile} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Stack>
        </Card>

        {/* Statistics Cards - Only show if file is uploaded */}
        {file && validationResult && (
          <>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
              {/* Total Count */}
              <Card sx={{ p: 3, bgcolor: "grey.100" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Số lượng nhân viên
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {totalCount}
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {/* Valid Count */}
              <Card sx={{ p: 3, bgcolor: "success.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: "success.main" }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Hợp lệ
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {validCount}
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {/* Error Count */}
              <Card sx={{ p: 3, bgcolor: "error.50" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <ErrorIcon sx={{ fontSize: 40, color: "error.main" }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Lỗi
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="error.main">
                      {errorCount}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>

            {/* Success/Error Display */}
            {errorCount === 0 ? (
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{
                  bgcolor: "success.50",
                  border: "1px solid",
                  borderColor: "success.main",
                }}
              >
                <AlertTitle sx={{ fontWeight: "bold" }}>
                  Không có lỗi nào trong tệp
                </AlertTitle>
                <Typography variant="body2">
                  Tất cả {validCount} bản ghi đều hợp lệ. Bạn có thể tiếp tục import ngay.
                </Typography>
              </Alert>
            ) : (
              <Card sx={{ p: 3 }}>
                <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle1" color="text.primary">
                    Xem trước dữ liệu
                  </Typography>
                </Box>

                {/* Error DataGrid Table with Dynamic Columns */}
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={validationResult.invalidRecords.map((record, index) => {
                      // Create row data with all fields from the record
                      const rowData: any = {
                        id: index,
                        rowNumber: record.row,
                        fieldErrors: record.fieldErrors || {},
                      };

                      // Add all data fields to the row
                      DEFAULT_TEMPLATE_STRUCTURE.columns.forEach((col) => {
                        rowData[col.fieldKey] = record.data[col.fieldKey] || "";
                      });

                      return rowData;
                    })}
                    columns={createDynamicColumns(DEFAULT_TEMPLATE_STRUCTURE.columns)}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      "& .MuiDataGrid-cell": {
                        borderColor: "divider",
                      },
                      "& .MuiDataGrid-columnHeaders": {
                        bgcolor: "grey.100",
                        borderColor: "divider",
                      },
                      "& .MuiDataGrid-row:hover": {
                        bgcolor: "error.50",
                      },
                    }}
                  />
                </Box>
              </Card>
            )}
          </>
        )}

        {/* Import Result */}
        {importResult && (
          <Card sx={{ p: 3 }}>
            <Alert
              severity={importResult.failedCount === 0 ? "success" : "warning"}
              icon={importResult.failedCount === 0 ? <CheckCircleIcon /> : <ErrorIcon />}
              sx={{ mb: importResult.errors.length > 0 ? 2 : 0 }}
            >
              <AlertTitle sx={{ fontWeight: "bold" }}>Kết quả import</AlertTitle>
              <Typography variant="body2">
                Thành công: {importResult.successCount} nhân viên
                {importResult.failedCount > 0 && ` | Thất bại: ${importResult.failedCount} nhân viên`}
              </Typography>
            </Alert>

            {/* Import Error DataGrid Table */}
            {importResult.errors.length > 0 && (
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={importResult.errors.map((error, index) => ({
                    id: index,
                    rowNumber: error.row,
                    employeeCode: error.employeeCode,
                    error: error.error,
                  }))}
                  columns={[
                    {
                      field: "rowNumber",
                      headerName: "STT",
                      width: 80,
                      headerAlign: "center",
                      align: "center",
                      renderCell: (params) => (
                        <Chip
                          label={params.value}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      ),
                    },
                    {
                      field: "employeeCode",
                      headerName: "Mã nhân viên",
                      width: 200,
                    },
                    {
                      field: "error",
                      headerName: "Lỗi",
                      flex: 1,
                      minWidth: 400,
                      renderCell: (params) => (
                        <Typography variant="body2" color="error">
                          {params.value}
                        </Typography>
                      ),
                    },
                  ]}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                  disableRowSelectionOnClick
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    "& .MuiDataGrid-cell": {
                      borderColor: "divider",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      bgcolor: "grey.100",
                      borderColor: "divider",
                    },
                    "& .MuiDataGrid-row:hover": {
                      bgcolor: "warning.50",
                    },
                  }}
                />
              </Box>
            )}
          </Card>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={!file || errorCount > 0 || isProcessing || isImporting}
          >
            {isImporting ? "Đang import..." : "Thêm hàng loạt"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default EmployeeImport;

