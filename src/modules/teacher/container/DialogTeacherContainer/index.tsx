"use client";
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { useGetTeacher } from "../../hooks/useGetTeacher";
import { Alert, DialogContent, OutlinedInput } from "@mui/material";
import { SearchIcon } from "@/shared/assets/icons";
import { DataGrid, DataGridProps, GridRowParams, GridRowSelectionModel } from "@mui/x-data-grid";
import { columns } from "./columns";
import { Teacher } from "@/model/teacher.model";
import TableData from "@/shared/ui/TableData";

export interface DialogTeacherContainerProps {
  open?: boolean;
  onClose?: () => void;
  onOk?: (data: Teacher[]) => void;
  values?: string[];
}
const DialogTeacherContainer: React.FC<DialogTeacherContainerProps> = ({
  open = false,
  onClose,
  onOk,
  values = [
    "06297383-75f2-4a0e-bbc8-14f69f1a9af1",
    "b68d4fb5-c7ea-487f-acf0-835941f54546",
    "be66dd80-429a-46b9-9762-d8de8b0272a7",
  ],
}) => {
  const { data: teachersData, isPending } = useGetTeacher({ enabled: open });

  const teacherList = useMemo(() => teachersData?.data || [], []);

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    ids: new Set(values),
    type: "include",
  });

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher[]>(() => {
    if (!teachersData?.data || !values.length) return [];
    return teachersData.data.filter((item) => values.includes(item.id));
  });

  const handleRowSelectionModelChange: DataGridProps["onRowSelectionModelChange"] = (newSelect, detail) => {
    // setSelectedTeacher((prevList) => {
    //   const rowIds = [...newSelect.ids];
    //   const newRowId = [...rowIds].pop();
    //   // console.log(rowIds);
    //   if (!newRowId) return prevList;
    //   let newList = [...prevList];
    //   const existsItem = newList.find((item) => item.id === newRowId);
    //   const rowData = detail.api.getRow<Teacher>(newRowId);
    //   return existsItem
    //     ? newList.filter((item) => item.id !== newRowId)
    //     : rowData
    //     ? [...newList, rowData]
    //     : [...newList];
    // });
  };

  const handleClose = () => {
    if (values.length) {
      setRowSelectionModel((prev) => ({ ...prev, ids: new Set(values) }));
    }
    onClose?.();
  };
  const handleClickOk = useCallback(() => {
    const idsSet = rowSelectionModel.ids;

    const teachers = teacherList.filter((item) => [...idsSet].includes(item.id));

    teachers && onOk?.(teachers);
    onClose?.();
  }, [rowSelectionModel]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <Toolbar
        sx={(theme) => ({
          minHeight: 48,
          borderBottom: "1px solid",
          borderColor: theme.palette.grey[300],
          [theme.breakpoints.up("md")]: {
            paddingInline: "1rem",
            minHeight: 60,
          },
        })}
      >
        <Typography sx={{ flex: 1 }} variant="h6" component="div">
          Chỉ định giảng viên phụ trách
        </Typography>
        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close" className="-mr-3">
          <CloseIcon />
        </IconButton>
      </Toolbar>

      <DialogContent
        sx={(theme) => ({
          paddingInline: "1rem",
        })}
      >
        <div className="header mb-6">
          <OutlinedInput
            size="small"
            placeholder="TIm kiem"
            endAdornment={<SearchIcon />}
            className="w-full max-w-[320px]"
          />
        </div>
        <div>
          {/* {error?.message} */}
          {teachersData?.error?.message && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {teachersData?.error?.message}
            </Alert>
          )}
          <DataGrid
            rows={teacherList}
            columns={columns}
            loading={isPending}
            density="standard"
            pageSizeOptions={[5, 10]}
            checkboxSelection
            disableColumnSelector
            disableColumnSorting
            disableColumnResize
            disableRowSelectionOnClick
            disableColumnMenu
            onRowSelectionModelChange={(rowModel) => setRowSelectionModel(rowModel)}
            rowSelectionModel={rowSelectionModel}
            // initialState={{ pagination: { paginationModel } }}
            // onRowClick={handleClickRow}
            // onRowSelectionModelChange={handleRowSelectionModelChange}
            sx={{ border: 0 }}
          />
        </div>
      </DialogContent>
      <Toolbar
        sx={(theme) => ({
          minHeight: 48,
          borderTop: "1px solid",
          borderColor: theme.palette.grey[300],
          justifyContent: "end",
          [theme.breakpoints.up("md")]: {
            paddingInline: "1rem",
            minHeight: 60,
          },
        })}
      >
        <div className="flex items-center gap-2">
          <Button autoFocus color="inherit" variant="outlined" onClick={handleClose} sx={{ minWidth: 96 }}>
            Huỷ
          </Button>
          <Button autoFocus onClick={handleClickOk} sx={{ minWidth: 96 }}>
            Xác nhận
          </Button>
        </div>
      </Toolbar>
    </Dialog>
  );
};

export default memo(DialogTeacherContainer);
