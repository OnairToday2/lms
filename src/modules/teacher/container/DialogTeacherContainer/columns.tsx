"use client";
import { alpha, Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Teacher } from "@/model/teacher.model";

export const columns: GridColDef<Teacher>[] = [
  {
    field: "id",
    headerName: "ID",
    width: 50,
    renderCell: (params) => {
      return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
    },
  },
  {
    field: "name",
    headerName: "Họ và tên",
    width: 220,
  },
  {
    field: "identity_code",
    headerName: "Code",
    width: 140,
    renderCell: ({ row }) => {
      return (
        <Chip
          label={row.identity_code}
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
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 240,
  },
];
