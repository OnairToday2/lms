"use client";
import * as React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import type { ValidateEmployeeFileResultDto } from "@/types/dto/employee.dto";
import type { TemplateColumn } from "@/utils/employees/template-parser";

interface EmployeeValidationTableProps {
  validationResult: ValidateEmployeeFileResultDto;
  templateColumns: TemplateColumn[];
}

function createDynamicColumns(templateColumns: TemplateColumn[]): GridColDef[] {
  const columns: GridColDef[] = [];

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
                borderRadius: 0.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isEmpty ? "text.secondary" : "text.primary",
                  fontStyle: isEmpty ? "italic" : "normal",
                  fontWeight: "normal",
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

  columns.push({
    field: "status",
    headerName: "Trạng thái",
    width: 150,
    headerAlign: "center",
    align: "center",
    renderCell: (params: GridRenderCellParams) => {
      const isValid = params.row.isValid;

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            width: "100%",
            height: "100%",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isValid ? "success.main" : "error.main",
              fontWeight: "normal",
              overflow: "hidden",
            }}
          >
            {isValid ? "Hợp lệ" : "Không hợp lệ"}
          </Typography>
        </Box>
      );
    },
  });

  return columns;
}

const EmployeeValidationTable: React.FC<EmployeeValidationTableProps> = ({
  validationResult,
  templateColumns,
}) => {
  const rows = React.useMemo(() => {
    // Combine valid and invalid records
    const allRows: any[] = [];
    let rowIndex = 0;

    // Add invalid records
    validationResult.invalidRecords.forEach((record) => {
      const rowData: any = {
        id: rowIndex++,
        rowNumber: record.row,
        fieldErrors: record.fieldErrors || {},
        isValid: false,
      };

      // Add all data fields to the row
      templateColumns.forEach((col) => {
        rowData[col.fieldKey] = record.data[col.fieldKey] || "";
      });

      allRows.push(rowData);
    });

    // Add valid records
    validationResult.validRecords.forEach((record) => {
      const rowData: any = {
        id: rowIndex++,
        rowNumber: rowIndex, // Valid records don't have row numbers, use index
        fieldErrors: {},
        isValid: true,
      };

      // Add all data fields to the row
      templateColumns.forEach((col) => {
        rowData[col.fieldKey] = (record as any)[col.fieldKey] || "";
      });

      allRows.push(rowData);
    });

    // Sort by row number if available, otherwise by id
    return allRows.sort((a, b) => {
      if (a.rowNumber && b.rowNumber) {
        return a.rowNumber - b.rowNumber;
      }
      return a.id - b.id;
    });
  }, [validationResult, templateColumns]);

  const columns = React.useMemo(
    () => createDynamicColumns(templateColumns),
    [templateColumns]
  );

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
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
        }}
      />
    </Box>
  );
};

export default EmployeeValidationTable;

