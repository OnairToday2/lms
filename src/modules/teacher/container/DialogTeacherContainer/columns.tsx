"use client";
import { alpha, Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { EmployeeTeacherTypeItem } from "@/model/employee.model";
export const columns: GridColDef<EmployeeTeacherTypeItem>[] = [
  {
    field: "id",
    headerName: "ID",
    width: 50,
    renderCell: (params) => {
      return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
    },
  },
  {
    field: "fullName",
    headerName: "Họ và tên",
    renderCell: ({ row }) => {
      return row.profiles?.full_name;
    },
    width: 220,
  },
  {
    field: "identity_code",
    headerName: "Code",
    width: 140,
    renderCell: ({ row }) => {
      return (
        <Chip
          label={row.employee_code}
          color="primary"
          sx={(theme) => ({
            backgroundColor: alpha(theme.palette.primary["main"], 0.2),
            color: theme.palette.primary["dark"],
            borderRadius: "0.375rem",
            borderColor: "transparent",
          })}
        />
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    renderCell: ({ row }) => {
      return row.profiles?.email;
    },
    sortable: false,
    width: 240,
  },
];
