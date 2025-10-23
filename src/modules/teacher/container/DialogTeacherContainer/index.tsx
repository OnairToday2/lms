"use client";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { useGetTeachersQuery } from "../../hooks/useGetTeacher";
import { Alert, DialogContent, FilledInput, FilledInputProps } from "@mui/material";
import { SearchIcon } from "@/shared/assets/icons";
import { DataGrid, DataGridProps, GridRowSelectionModel } from "@mui/x-data-grid";
import useDebounce from "@/hooks/useDebounce";
import { columns } from "./columns";
import { EmployeeTeacherTypeItem } from "@/model/employee.model";

export interface DialogTeacherContainerProps {
  open?: boolean;
  onClose?: () => void;
  onOk?: (data: EmployeeTeacherTypeItem[]) => void;
  values?: string[];
}
const DialogTeacherContainer: React.FC<DialogTeacherContainerProps> = ({
  open = false,
  onClose,
  onOk,
  values = [],
}) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [searchTeacherName, setSearchTeacherName] = useState("");
  const searchDebouce = useDebounce(searchTeacherName, 600);
  const prevRowIdsSet = useRef<GridRowSelectionModel["ids"]>(null);
  const [selectTeacherList, setSelectTeacherList] = useState<EmployeeTeacherTypeItem[]>([]);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    ids: new Set(values),
    type: "include",
  });

  const { data: teachersData, isPending } = useGetTeachersQuery({
    queryParams: {
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      exclude: values, // exclude teacher selected
      search: searchDebouce,
    },
    enabled: open,
  });

  const teacherList = useMemo(() => teachersData?.data || [], [teachersData?.data]);
  const rowCount = useMemo(() => teachersData?.count || 0, [teachersData?.count]);

  const handleClose = () => {
    //Reset State after close
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setRowSelectionModel((prev) => ({ ...prev, ids: new Set() }));
    prevRowIdsSet.current = new Set();
    setSelectTeacherList([]);
    onClose?.();
  };

  const handleClickOk = useCallback(() => {
    selectTeacherList && onOk?.(selectTeacherList);
    handleClose();
  }, [rowSelectionModel]);

  const handlePaginationModelChange: Exclude<DataGridProps["onPaginationModelChange"], undefined> = useCallback(
    (paginationModel) => {
      setPaginationModel(paginationModel);
    },
    [],
  );

  const handleRowSelectModelChange: Exclude<DataGridProps["onRowSelectionModelChange"], undefined> = useCallback(
    (newRowSelectModel, details) => {
      /**
       *  multipleRowsSelection occur when change pagination.
       * return to prevent set Empty empty RowModel Selection
       */
      if (details.reason === "multipleRowsSelection") return;

      const prevIdsSet = prevRowIdsSet.current || new Set();

      const addedRow = newRowSelectModel.ids.difference(prevIdsSet);
      const removeRow = prevIdsSet.difference(new Set(newRowSelectModel.ids));

      setSelectTeacherList((prevTeachers) => {
        /**
         * Get Teachers in newIdsSet of current Row Model
         */

        let updateTeacherList = [...prevTeachers];

        if (addedRow.size > 0) {
          addedRow.forEach((rowId) => {
            const teacher = teacherList.find((tc) => tc.id === rowId);
            updateTeacherList = teacher ? [...updateTeacherList, teacher] : [...updateTeacherList];
          });
        }
        if (removeRow.size > 0) {
          removeRow.forEach((rowId) => {
            updateTeacherList = [...updateTeacherList].filter((it) => it.id !== rowId);
          });
        }

        return updateTeacherList;
      });
      const updateRowModel =
        addedRow.size > 0 ? new Set([...prevIdsSet, ...newRowSelectModel.ids]) : newRowSelectModel.ids;

      /**
       * Store newIdsSet on every change
       */
      prevRowIdsSet.current = updateRowModel;

      setRowSelectionModel((prevModel) => ({
        ...prevModel,
        ids: updateRowModel,
      }));
    },
    [teacherList],
  );

  const isDisabledOkButton = Boolean(!selectTeacherList.length);

  const handleSearchTeacherName: FilledInputProps["onChange"] = (evt) => {
    setSearchTeacherName(evt.target.value);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
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
          <FilledInput
            placeholder="Tìm kiếm..."
            value={searchTeacherName}
            onChange={handleSearchTeacherName}
            endAdornment={<SearchIcon />}
            size="small"
            sx={{ minWidth: 280 }}
          />
        </div>
        <div>
          <DataGrid
            rows={teacherList}
            columns={columns}
            rowCount={rowCount}
            loading={isPending}
            density="standard"
            pageSizeOptions={[10, 15, 20]}
            checkboxSelection
            disableColumnSelector
            disableColumnSorting
            disableColumnResize
            disableRowSelectionOnClick
            disableColumnMenu
            paginationMode="server"
            onRowSelectionModelChange={handleRowSelectModelChange}
            rowSelectionModel={rowSelectionModel}
            paginationModel={paginationModel}
            onPaginationModelChange={isPending ? undefined : handlePaginationModelChange}
            sx={{
              border: 0,
              ".MuiDataGrid-columnHeaders": {
                ".MuiDataGrid-columnHeaderCheckbox": {
                  pointerEvents: "none",
                },
              },
            }}
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
          <Button autoFocus onClick={handleClickOk} sx={{ minWidth: 96 }} disabled={isDisabledOkButton}>
            Xác nhận
          </Button>
        </div>
      </Toolbar>
    </Dialog>
  );
};

export default memo(DialogTeacherContainer);
