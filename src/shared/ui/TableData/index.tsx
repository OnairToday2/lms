import { createContext, memo, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TablePaginationOwnProps,
  Typography,
} from "@mui/material";
import TableDataRow, { TableRowDataProps } from "./TableDataRow";
import TableDataHeader from "./TableDataHeader";
import TableRowFixedWidth from "./TableRowFixedWith";
import TableRowDataProvider from "./TableRowDataProvider";

export type TableDataProps<T> = {
  rowKey?: string;
  rows?: T[];
  columns: TableRowDataProps<T>["columns"];
  loading?: boolean;
  minWidth?: number;
  hoverRow?: boolean;
  stickyHeader?: boolean;
  showRowCount?: boolean;
  pagination?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
    perPageOptions?: number[];
    onPagination?: (page: number, pageSize: number) => void;
  };
  onRowClick?: TableRowDataProps<T>["onRowClick"];
  onCellClick?: TableRowDataProps<T>["onCellClick"];
};

const initPagination = {
  page: 0,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  perPageOptions: [10, 20, 30, 50],
};
type PaginationTable = Omit<Required<Exclude<typeof initPagination, undefined>>, "onPagination" | "onChangePageSize">;

const TableData = <T extends { id: number | string; [key: string]: any }>({
  rowKey,
  rows,
  columns,
  minWidth,
  loading,
  hoverRow,
  pagination = initPagination,
  stickyHeader,
  showRowCount,
  onRowClick,
  onCellClick,
}: TableDataProps<T>) => {
  const [tablePagination, setTablePaginations] = useState<PaginationTable>(() => {
    return {
      ...initPagination,
      page: pagination?.page ? pagination?.page : initPagination.page,
      pageSize: pagination?.pageSize || initPagination.pageSize,
      total: pagination?.total || rows?.length || initPagination.total,
      totalPages: pagination?.totalPages || initPagination.totalPages,
      perPageOptions: pagination?.perPageOptions || initPagination.perPageOptions,
    };
  });
  const { page, pageSize, total, totalPages, perPageOptions } = tablePagination;

  const items = useMemo(() => {
    // const start = page > 0 ? (page - 1) * pageSize : 0;
    // const end = page > 0 ? page * pageSize : pageSize;
    return rows?.slice(0, pageSize) || [];
  }, [pageSize, page, rows]);

  const onChangePage: TablePaginationOwnProps["onPageChange"] = (event, newPage) => {
    if (pagination?.onPagination) {
      pagination.onPagination(newPage + 1, pageSize);
    } else {
      setTablePaginations((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };
  const onChangePageSize: TablePaginationOwnProps["onRowsPerPageChange"] = (evt) => {
    const newPageSize = parseInt(evt.target.value);
    if (pagination?.onPagination) {
      pagination.onPagination(page, newPageSize);
    } else {
      setTablePaginations((prev) => ({
        ...prev,
        pageSize: newPageSize,
      }));
    }
  };
  const genRowkey = useCallback(
    (row: T) => {
      const currentRowKey = row[rowKey || "id"];
      if (!currentRowKey) {
        console.error("Row key is not defined for row:", row);
      }
      if (typeof currentRowKey !== "string" && typeof currentRowKey !== "number") {
        console.error("Row key must be a string or number.", currentRowKey);
      }
      return currentRowKey.toString();
    },
    [rowKey],
  );
  useLayoutEffect(() => {
    if (!pagination) return;

    setTablePaginations((prev) => {
      let newPaginations = { ...prev };
      const { page, ...restPaginationUpdate } = pagination;
      if (page) {
        newPaginations = { ...newPaginations, page: page - 1 };
      }
      return { ...newPaginations, ...restPaginationUpdate };
    });
  }, [pagination?.page, pagination?.pageSize, pagination?.perPageOptions, pagination?.total, pagination?.totalPages]);

  return (
    <TableRowDataProvider>
      <TableContainer component={Paper} className="table-container shadow-none">
        <Box
          component="div"
          className="container-wraper w-full overflow-x-auto"
          sx={{
            scrollbarWidth: "thin",
            scrollbarColor: "#eaeaea transparent",
            scrollbarGutter: "stable",
          }}
        >
          <Table stickyHeader={stickyHeader} sx={{ minWidth: minWidth }} aria-label="sticky table">
            <TableHead>
              <TableDataHeader showRowCount={showRowCount} columns={columns} />
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRowFixedWidth columnCount={columns.length}>
                  <Box component="div" className="flex items-center justify-center py-20">
                    <Typography component="p" className="opacity-60 text-sm">
                      Loading...
                    </Typography>
                  </Box>
                </TableRowFixedWidth>
              ) : !items?.length ? (
                <TableRowFixedWidth columnCount={columns.length}>
                  <Box component="div" className="flex items-center justify-center py-20">
                    <Box component="div" className="flex flex-col gap-3 items-center">
                      {/* <Iconify
											icon="hugeicons:inbox"
											className="w-12 h-12 opacity-60"
										/> */}
                      <Typography component="p" className="opacity-60 text-sm">
                        Đang trống.
                      </Typography>
                    </Box>
                  </Box>
                </TableRowFixedWidth>
              ) : (
                items.map((row, _index) => (
                  <TableDataRow
                    key={genRowkey(row)}
                    showRowCount={showRowCount}
                    hoverRow={hoverRow}
                    indexRow={_index}
                    page={page + 1}
                    pageSize={pageSize}
                    row={row}
                    columns={columns}
                    onRowClick={onRowClick}
                    onCellClick={onCellClick}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          component="div"
          count={total}
          rowsPerPageOptions={perPageOptions}
          rowsPerPage={pageSize}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangePageSize}
          page={page}
        />
      </TableContainer>
    </TableRowDataProvider>
  );
};

export default memo(TableData) as typeof TableData;
