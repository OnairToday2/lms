import React from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
const columns = React.useMemo<GridColDef[]>(
  () => [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", width: 140 },
    { field: "age", headerName: "Age", type: "number" },
    {
      field: "joinDate",
      headerName: "Join date",
      type: "date",
      valueGetter: (value) => value && new Date(value),
      width: 140,
    },
    {
      field: "role",
      headerName: "Department",
      type: "singleSelect",
      valueOptions: ["Market", "Finance", "Development"],
      width: 160,
    },
    { field: "isFullTime", headerName: "Full-time", type: "boolean" },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      align: "right",
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit-item"
          icon={<EditIcon />}
          label="Edit"
        />,
        <GridActionsCellItem
          key="delete-item"
          icon={<DeleteIcon />}
          label="Delete"
        />,
      ],
    },
  ],
  [],
);
export { columns };
