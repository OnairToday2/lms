"use client";
import React, { memo, useEffect, useId, useRef, useState } from "react";
import {
  alpha,
  Box,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  Menu,
  MenuItem,
  MenuList,
  OutlinedInput,
  Popover,
  styled,
  Typography,
} from "@mui/material";
import type { MenuProps, PopoverProps } from "@mui/material";
import { isArray, isNull, isUndefined } from "lodash";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type OptionType = { id: string | number; label?: string; [key: string]: any };
type Value = string | number | (string | number)[];

export type SelectFieldV2Props = {
  options: OptionType[];
  helperText?: string;
  optionField?: {
    value: string;
    label: string;
  };
  placeholder?: string;
  onChange?: (value: Value) => void;
  required?: boolean;
  onSearch?: () => void;
  value?: Value;
  error?: boolean;
  label?: string;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  name?: string;
};
const SelectFieldV2 = ({
  options,
  value,
  label,
  error,
  disabled,
  className,
  helperText,
  multiple = true,
  optionField,
  placeholder,
  name,
  onChange,
  required,
}: SelectFieldV2Props) => {
  const fieldId = useId();
  const [selectedItem, setSelectedItem] = useState<Value>(multiple ? [] : "");

  const [menuWidth, setMenuWidth] = useState(0);
  const [openPopover, setOpenPopOver] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const getOptionLabelWithOptionField = (option: OptionType) => {
    if (!optionField) return option?.label;
    const optionLabel = option[optionField.label];
    if (typeof optionLabel === "string" || typeof optionLabel === "number") return optionLabel.toString();
  };

  const getOptionValueWithOptionField = (option: OptionType) => {
    if (!optionField) return option.id;

    const optionValue = option[optionField.value as keyof OptionType];

    return typeof optionValue === "string" || typeof optionValue === "number" ? optionValue : option.id;
  };

  const getOptionLabel = (value: string | number) => {
    const opt = optionField ? options.find((o) => o[optionField.value] === value) : options.find((o) => o.id === value);
    return opt ? getOptionLabelWithOptionField(opt) : "";
  };

  const handleSelectOptionItem = (option: OptionType) => {
    const value = getOptionValueWithOptionField(option);
    setSelectedItem((prev) => {
      if (multiple) {
        const prevArr = isArray(prev) ? prev : [];
        const exists = prevArr.includes(value);
        const newValue = exists ? prevArr.filter((v) => v !== value) : [...prevArr, value];
        onChange?.(newValue);
        return newValue;
      } else {
        onChange?.(value);
        closePopover();
        return value;
      }
    });
  };

  const toggleOpenDropdown = () => setOpenPopOver((prev) => !prev);
  const closePopover = () => setOpenPopOver(false);

  const renderSelectedValues = (selected: Value) => {
    if (isUndefined(selected) || isNull(selected) || (isArray(selected) && !selected.length)) {
      return placeholder ? <Typography sx={{ fontSize: "0.875rem", opacity: 0.6 }}>{placeholder}</Typography> : null;
    }

    if (multiple) {
      const listValue = isArray(selected) ? selected : [selected];
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {listValue.map((item) => (
            <CustomChip key={item} label={getOptionLabel(item)} />
          ))}
        </Box>
      );
    }
    const singleValue = isArray(selected) ? selected[0] : selected;
    if (singleValue) {
      return <CustomChip label={getOptionLabel(singleValue)} />;
    }

    return placeholder ? <Typography sx={{ fontSize: "0.875rem", opacity: 0.6 }}>{placeholder}</Typography> : null;
  };

  const hasSelectedItem = (option: OptionType) => {
    const value = getOptionValueWithOptionField(option);
    return isArray(selectedItem) ? selectedItem.some((it) => it === value) : value === selectedItem;
  };
  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const info = el.getBoundingClientRect();
    setMenuWidth(info.width);
  }, [anchorRef]);

  return (
    <FormControl disabled={disabled} error={!!error} className={className}>
      {label ? (
        <FormLabel htmlFor={fieldId}>
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </FormLabel>
      ) : null}
      <Box
        component="div"
        className="select-field"
        ref={anchorRef}
        sx={(theme) => ({
          border: "1px solid",
          borderColor: theme.palette.grey[400],
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          padding: "0.875rem 0.875rem",
          paddingRight: "2rem",
        })}
        aria-describedby={fieldId}
        onClick={toggleOpenDropdown}
      >
        {renderSelectedValues(selectedItem)}
        <KeyboardArrowDownIcon
          fontSize="small"
          sx={(theme) => ({
            position: "absolute",
            right: 7,
            top: "calc(50% - 0.5em)",
            color: theme.palette.grey[600],
            transform: openPopover ? "rotateX(180deg)" : undefined,
          })}
        />
      </Box>
      <DropdownSelection id="simple-popover" anchorEl={anchorRef.current} open={openPopover} onClose={closePopover}>
        <div className="px-4 pt-4 pb-2 bg-white sticky top-0 z-10">
          <OutlinedInput size="small" className="w-full" placeholder="Tìm kiếm" />
        </div>
        <MenuList
          sx={{
            "&.MuiList-root": {
              width: menuWidth,
            },
          }}
        >
          {placeholder ? (
            <MenuItem
              disabled
              sx={{
                "&.Mui-disabled": {
                  opacity: 0.6,
                },
              }}
            >
              {placeholder}
            </MenuItem>
          ) : null}
          {options.map((option, _index) => (
            <MenuItem
              key={_index}
              value={getOptionValueWithOptionField(option)}
              onClick={() => handleSelectOptionItem(option)}
              sx={(theme) => ({
                backgroundColor: hasSelectedItem(option) ? theme.palette.grey[200] : undefined,
              })}
            >
              {getOptionLabelWithOptionField(option)}
            </MenuItem>
          ))}
        </MenuList>
      </DropdownSelection>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};
export default memo(SelectFieldV2);

const CustomChip = styled(Chip)(({ theme }) => ({
  borderRadius: "4px",
  background: alpha(theme.palette.grey[300], 0.1),
  borderColor: alpha(theme.palette.grey[600], 0.3),
  "& .MuiChip-label": {
    color: theme.palette.grey[800],
  },
}));

const DropdownSelection = styled((props: PopoverProps) => (
  <Popover
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    maxHeight: 320,
    scrollbarWidth: "none",
    marginTop: "4px",
    border: "1px solid",
    borderColor: theme.palette.grey[100],
    boxShadow: "0px 8px 16px -6px rgb(0 0 0 / 10%), 0px 12px 36px -12px rgb(0 0 0 / 16%)",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
        ...theme.applyStyles("dark", {
          color: "inherit",
        }),
      },
      "&:active": {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));
