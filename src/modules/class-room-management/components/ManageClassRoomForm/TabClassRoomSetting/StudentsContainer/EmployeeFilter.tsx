import useDebounce from "@/hooks/useDebounce";
import { FilterFunnelIcon, SearchIcon } from "@/shared/assets/icons";
import {
  Button,
  ButtonProps,
  Checkbox,
  FilledInput,
  FormControlLabel,
  List,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import { memo, useRef, useState } from "react";
import { useId } from "react";

export interface EmployeeFilterProps {
  className?: string;
  onSearch?: (value: string) => void;
}
const EmployeeFilter: React.FC<EmployeeFilterProps> = ({ className, onSearch }) => {
  const id = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();

  const filterId = useRef(`employee-filter-${id}`);

  const open = !!anchorEl;

  const handleClose = () => {
    setAnchorEl(undefined);
  };
  const handleOpenFilter: ButtonProps["onClick"] = (evt) => {
    setAnchorEl(evt.currentTarget);
  };

  return (
    <form className="w-full flex items-center">
      <div className="flex-1 flex">
        <FilledInput
          placeholder="Tìm kiếm..."
          onChange={(evt) => onSearch?.(evt.target.value)}
          endAdornment={<SearchIcon />}
          size="small"
          className="w-full max-w-[240px]"
        />
      </div>
      <div>
        <Button
          aria-describedby={filterId.current}
          variant="outlined"
          color="inherit"
          onClick={handleOpenFilter}
          sx={{ paddingBlock: 1, minWidth: "auto" }}
          startIcon={<FilterFunnelIcon className="w-3 h-3" />}
          size="small"
        >
          <Typography sx={{ fontSize: "0.875rem" }}>Lọc</Typography>
          {/* <span className="w-5 h-5 text-xs bg-gray-600 rounded-full inline-flex items-center justify-center ml-2 text-white">
                {1}
              </span> */}
        </Button>
        <Popover
          id={filterId.current}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <div className="flex gap-2 min-w-[450px]">
            <div className="w-36">
              <List>
                <MenuItem>Chi nhánh</MenuItem>
                <MenuItem>Phòng ban</MenuItem>
                <MenuItem>Vai trò</MenuItem>
              </List>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <FormControlLabel control={<Checkbox size="small" />} label="ICT" />
              <FormControlLabel control={<Checkbox size="small" />} label="ICT" />
              <FormControlLabel control={<Checkbox size="small" />} label="ICT" />
            </div>
          </div>
        </Popover>
      </div>
    </form>
  );
};

export default memo(EmployeeFilter);
