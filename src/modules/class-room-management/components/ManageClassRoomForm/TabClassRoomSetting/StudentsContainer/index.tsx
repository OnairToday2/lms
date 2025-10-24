import * as React from "react";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
  Alert,
  alpha,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  Pagination,
  PaginationProps,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { EmployeeStudentWithProfileItem } from "@/model/employee.model";
import EmployeeFilter, { EmployeeFilterProps } from "./EmployeeFilter";
import EmptyData from "@/shared/ui/EmptyData";
import { cn } from "@/utils";
import { CloseIcon } from "@/shared/assets/icons";
import useDebounce from "@/hooks/useDebounce";
import useGetEmployeeQuery from "@/modules/class-room-management/operation/query";

const BoxWraper = styled("div")(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.grey[300],
  height: 680,
  overflowY: "hidden",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
}));

const BoxHeader = styled(Box)(({ theme }) => ({
  paddingInline: "16px",
  paddingBlock: "12px",
  backgroundColor: theme.palette.grey[200],
}));

const BoxToolbar = styled(Toolbar)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    paddingInline: "16px",
  },
}));

const BoxContent = styled(Box)(() => ({
  height: "100%",
  overflowY: "auto",
  scrollbarWidth: "thin",
}));
export interface StudentsContainerProps {
  seletedItems?: EmployeeStudentWithProfileItem[];
  onChange: (data: EmployeeStudentWithProfileItem[]) => void;
}
const StudentsContainer: React.FC<StudentsContainerProps> = ({ seletedItems = [], onChange }) => {
  const [selectedList, setSelectedList] = React.useState<EmployeeStudentWithProfileItem[]>(seletedItems);
  const [queryParams, setQueryParams] = React.useState({ page: 1, pageSize: 20, search: "" });
  const [departmentIds, setDepartmentIds] = React.useState<string[]>([]);
  const [branchIds, setBranchIds] = React.useState<string[]>([]);
  const searchEmployeeNameDebounce = useDebounce(queryParams.search, 600);
  const { data: employeeData, isPending } = useGetEmployeeQuery({
    enabled: true,
    queryParams: {
      ...queryParams,
      search: searchEmployeeNameDebounce,
      organizationUnitIds: [...departmentIds, ...branchIds],
      // excludes: values,
    },
  });

  const prevEmployeeList = React.useRef<EmployeeStudentWithProfileItem[]>([]);
  const prevPaginationRef = React.useRef({
    total: 0,
    pageTotal: 1,
    page: queryParams.page,
    pageSize: queryParams.pageSize,
  });

  const employeeList = React.useMemo(() => {
    return employeeData?.data || [];
  }, [employeeData?.data]);

  const pageTotal = React.useMemo(() => {
    if (!employeeData?.count) return 1;
    return Math.ceil(employeeData.count / queryParams.pageSize);
  }, [employeeData?.count, queryParams.pageSize]);

  const total = React.useMemo(() => employeeData?.count || 0, [employeeData?.count]);

  const showingItemCount = React.useMemo(() => {
    if (queryParams.page === pageTotal) return prevPaginationRef.current.total;
    return queryParams.page * queryParams.pageSize;
  }, [queryParams, pageTotal, prevPaginationRef]);

  const handleChagePage: PaginationProps["onChange"] = (evt, newPage) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleAddEmployee = (epl: EmployeeStudentWithProfileItem) => {
    setSelectedList((prevEmployeeList) => {
      const newList = [...prevEmployeeList];
      const existItem = newList.find((it) => it.id === epl.id);
      return existItem ? prevEmployeeList : [...newList, epl];
    });
  };

  const handleRemoveItem = (itemId: string, data: EmployeeStudentWithProfileItem) => {
    setSelectedList((prevSelectedList) => {
      return prevSelectedList.filter((item) => item.id !== itemId);
    });
  };

  const isCheckedAllItem = React.useMemo(() => {
    const currentList = employeeData?.data;
    if (!currentList?.length) return false;
    return currentList.every((selectedItem) => selectedList.some((item) => item.id === selectedItem.id));
  }, [selectedList, employeeData?.data]);

  const toggleCheckAll = (checked?: boolean) => {
    const currentList = employeeData?.data;
    if (!currentList?.length) return;

    setSelectedList((prevSelectedList) => {
      let newSelectedList: EmployeeStudentWithProfileItem[] = [];

      if (checked) {
        const listMap = new Map<string, EmployeeStudentWithProfileItem>();

        [...currentList, ...prevSelectedList].forEach((item) => {
          listMap.set(item.id, item);
        });

        for (const [key, value] of listMap.entries()) {
          newSelectedList.push(value);
        }
      } else {
        prevSelectedList.forEach((sltItem) => {
          if (currentList.every((it) => it.id !== sltItem.id)) {
            newSelectedList.push(sltItem);
          }
        });
      }
      return newSelectedList;
    });
  };

  const handleRemoveALl = () => {
    setSelectedList([]);
  };
  const isIndeterminate = React.useMemo(() => {
    const currentList = employeeData?.data;
    if (!currentList?.length) return false;
    return currentList.some((item) => selectedList.some((it) => it.id === item.id));
  }, [employeeData?.data, selectedList]);

  const handleSearch: EmployeeFilterProps["onSearch"] = (searchText) => {
    setQueryParams((prev) => ({ ...prev, search: searchText }));
  };

  const handleFilterDepartment: EmployeeFilterProps["onSelectDepartment"] = (departmentId) => {
    setDepartmentIds((prev) => {
      let newList = [...prev];
      const isExist = newList.includes(departmentId);
      return isExist ? newList.filter((it) => it !== departmentId) : [...newList, departmentId];
    });
  };
  const handleFilterBranch: EmployeeFilterProps["onSelectDepartment"] = (branchId) => {
    setBranchIds((prev) => {
      let newList = [...prev];
      const isExist = newList.includes(branchId);
      return isExist ? newList.filter((it) => it !== branchId) : [...newList, branchId];
    });
  };
  React.useEffect(() => {
    onChange(selectedList);
  }, [selectedList]);

  React.useEffect(() => {
    if (isPending) return;
    prevPaginationRef.current = { pageTotal, total, page: queryParams.page, pageSize: queryParams.pageSize };
  }, [pageTotal, total, isPending, queryParams]);

  React.useEffect(() => {
    if (isPending) return;
    prevEmployeeList.current = employeeData?.data || [];
  }, [isPending, employeeData]);

  React.useEffect(() => {
    if (!seletedItems.length) return;
    setSelectedList(seletedItems);
  }, [seletedItems]);

  return (
    <div className="employee-data-transfer relative">
      {employeeData?.error ? <Alert severity="error">{employeeData.error.message}</Alert> : null}
      <div className="flex gap-6">
        <div className="w-1/2">
          <BoxWraper>
            <BoxHeader>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>{`Tất cả học viên (${total})`}</Typography>
            </BoxHeader>
            <BoxToolbar>
              <Checkbox
                indeterminate={!isCheckedAllItem && isIndeterminate}
                checked={isCheckedAllItem}
                onChange={(evt, checked) => toggleCheckAll?.(checked)}
                className="mr-4"
              />

              <EmployeeFilter
                onSearch={handleSearch}
                departmentValues={departmentIds}
                onSelectDepartment={handleFilterDepartment}
                branchValues={branchIds}
                onSelectBranch={handleFilterBranch}
              />
            </BoxToolbar>
            <Divider />
            <BoxContent
              className={cn({
                "opacity-60": isPending,
              })}
            >
              <div className="flex flex-col">
                {(isPending && prevEmployeeList.current.length ? prevEmployeeList.current : employeeList).map((emp) => (
                  <StudentItem
                    key={emp.id}
                    data={emp}
                    onClick={handleAddEmployee}
                    isSelected={hasSelected(emp.id, selectedList)}
                  />
                ))}
                {!isPending && !employeeList.length && (
                  <div className="flex items-center justify-center p-6">
                    <EmptyData iconSize="small" description="Danh sách đang trống." />
                  </div>
                )}
              </div>
            </BoxContent>
            <Divider />
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <Typography
                  sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                >{`Hiển thị ${showingItemCount} trên ${total}`}</Typography>
              </div>
              <Pagination
                variant="text"
                size="small"
                shape="rounded"
                count={isPending ? prevPaginationRef.current.pageTotal : pageTotal}
                page={isPending ? prevPaginationRef.current.page : queryParams.page}
                onChange={handleChagePage}
                disabled={isPending}
              />
            </div>
          </BoxWraper>
        </div>
        <div className="w-1/2">
          <BoxWraper>
            <BoxHeader>
              <Typography
                sx={{ fontWeight: "bold", fontSize: "0.875rem" }}
              >{`Học viên đã chọn (${selectedList.length})`}</Typography>
            </BoxHeader>
            <BoxToolbar>
              <Button variant="text" className="ml-auto" disabled={!selectedList.length} onClick={handleRemoveALl}>
                Xoá tất cả
              </Button>
            </BoxToolbar>
            <Divider />
            <BoxContent>
              {!selectedList?.length && (
                <EmptyData
                  title="Đang trống"
                  description={
                    <>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                        Chưa có học viên nào được gán lớp học này.
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                        vui lòng thêm học viên.
                      </Typography>
                    </>
                  }
                  className="mx-auto w-fit pt-12"
                />
              )}
              <div className="flex flex-col">
                {selectedList.map((emp) => (
                  <StudentItem key={emp.id} hideCheckbox data={emp} onRemove={handleRemoveItem} />
                ))}
              </div>
            </BoxContent>
          </BoxWraper>
        </div>
      </div>
    </div>
  );
};

export default StudentsContainer;

interface StudentItemProps {
  data: EmployeeStudentWithProfileItem;
  onClick?: (data: EmployeeStudentWithProfileItem) => void;
  isSelected?: boolean;
  hideCheckbox?: boolean;
  viewOnly?: boolean;
  onRemove?: (itemId: string, data: EmployeeStudentWithProfileItem) => void;
}
const StudentItem: React.FC<StudentItemProps> = React.memo(
  ({ data, onClick, isSelected, viewOnly = false, onRemove, hideCheckbox = false }) => {
    const { id, employee_code, profiles, employments } = data;
    const departmentName = React.useMemo(() => employments[0]?.organization_units?.name, [employments]);
    return (
      <ListItemButton
        role="listitem"
        {...(!viewOnly ? { onClick: () => onClick?.(data) } : { disableRipple: true, disableTouchRipple: true })}
        sx={(theme) => ({
          paddingInline: 2,
          paddingBlock: 1.5,
          borderRadius: 0,
          borderBottom: "1px solid",
          borderColor: theme.palette.grey[200],
        })}
      >
        <div className="flex items-center gap-2 flex-1">
          {!hideCheckbox ? (
            <ListItemIcon>
              <Checkbox checked={isSelected} tabIndex={-1} disableRipple />
            </ListItemIcon>
          ) : null}
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <Chip
                label={employee_code}
                color="primary"
                variant="filled"
                sx={(theme) => ({
                  background: alpha(theme.palette.primary["main"], 0.1),
                  color: theme.palette.primary["dark"],
                  borderColor: "transparent",
                  borderRadius: "5px",
                  fontSize: "0.75rem",
                })}
              />
              <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>{profiles?.full_name}</Typography>
            </div>
            <div className="flex gap-2">
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{departmentName}</Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{profiles?.email}</Typography>
            </div>
          </div>
          {onRemove ? (
            <IconButton
              sx={(theme) => ({
                borderRadius: "8px",
                border: "1px solid",
                borderColor: theme.palette.grey[300],
                backgroundColor: "white",
              })}
              onClick={() => onRemove(data.id, data)}
              size="small"
              className="ml-auto"
            >
              <CloseIcon className="w-5 h-5" />
            </IconButton>
          ) : null}
        </div>
      </ListItemButton>
    );
  },
);

const hasSelected = (itemId: string, items: EmployeeStudentWithProfileItem[]) => {
  return items.some((it) => it.id === itemId);
};
