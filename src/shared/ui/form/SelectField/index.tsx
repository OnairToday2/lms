"use client";
import React, { memo, useId } from "react";
import {
  alpha,
  Box,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  inputBaseClasses,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  styled,
  Typography,
} from "@mui/material";
import type { SelectProps } from "@mui/material";
import { CustomBaseInput } from "./CustomInputBase";
import { isArray } from "lodash";

type OptionType = { id: string | number; label?: string };

export type SelectFieldProps<Value extends number | string | string[] | number[] = string> = Omit<
  SelectProps<Value>,
  "onChange"
> & {
  options: OptionType[];
  helperText?: string;
  optionField?: {
    value: string;
    label: string;
  };
  placeholder?: string;
  onChange: (value: Value) => void;
  required?: boolean;
  onSearch?: () => void;
};
const SelectField = <Value extends number | string | string[] | number[]>({
  options,
  value: selectdValue,
  label,
  error,
  disabled,
  className,
  helperText,
  multiple = false,
  optionField,
  placeholder,
  name,
  onChange,
  required,
}: SelectFieldProps<Value>) => {
  const fieldId = useId();

  const handleChange = (event: SelectChangeEvent<typeof selectdValue>) => {
    const {
      target: { value },
    } = event;
    onChange(value as Value);
  };

  const getOptionLabelWithOptionField = (option: OptionType) => {
    let optionName;

    if (optionField) {
      if (
        typeof option[optionField.label as keyof OptionType] === "string" ||
        typeof option[optionField.label as keyof OptionType] === "number"
      ) {
        optionName = option[optionField.label as keyof OptionType]?.toString();
      }
    }
    return optionField ? optionName : option?.label;
  };

  const getOptionValueWithOptionField = (option: OptionType) => {
    let optionValue;

    if (optionField) {
      if (
        typeof option[optionField.value as keyof OptionType] === "string" ||
        typeof option[optionField.value as keyof OptionType] === "number"
      ) {
        optionValue = option[optionField.value as keyof OptionType]?.toString();
      }
    }
    return optionField ? optionValue : option.id;
  };

  const getOptionLabel = (value: string | number) => {
    let selectedOptionItem;
    if (optionField) {
      selectedOptionItem = options.find((option) => option[optionField.value as keyof OptionType] === value);

      return selectedOptionItem?.[optionField.label as keyof OptionType]?.toString();
    }

    selectedOptionItem = options.find((option) => option["id"] === value);

    return selectedOptionItem?.label?.toString();
  };

  const renderSelectedValues = (selected: Value) => {
    if (
      (!selected && typeof selected === "string") ||
      (!selected && typeof selected === "number") ||
      (isArray(selected) && !selected.length)
    ) {
      return placeholder ? <Typography sx={{ fontSize: "0.875rem", opacity: 0.6 }}>{placeholder}</Typography> : null;
    }

    if (multiple) {
      if (isArray(selected)) {
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((item) => (
              <StyledChip key={item} label={getOptionLabel(item)} />
            ))}
          </Box>
        );
      } else {
        return <StyledChip label={getOptionLabel(selected)} />;
      }
    } else {
      const optionItem = isArray(selected) ? selected[0] : selected;
      if (optionItem && !isArray(optionItem)) {
        return <StyledChip label={getOptionLabel(optionItem)} sx={{}} />;
      }
    }
  };

  const handleSearchChange = () => {};
  const selectId = `select-multiple-chip-${name}`;

  return (
    <FormControl disabled={disabled} error={!!error} className={className}>
      {label ? (
        <FormLabel htmlFor={fieldId}>
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </FormLabel>
      ) : null}
      <Select
        id={selectId}
        multiple={multiple}
        value={selectdValue}
        displayEmpty
        onChange={handleChange}
        input={<CustomBaseInput />}
        renderValue={renderSelectedValues}
        MenuProps={{
          PaperProps: {
            sx: (theme) => ({
              maxHeight: 250,
              width: 250,
              "& .MuiMenuItem-root": {
                "&:hover": {
                  background: theme.palette.grey[200],
                },
                "&.Mui-selected": {
                  backgroundColor: `${theme.palette.grey[200]}`,
                  fontWeight: 600,
                },
              },
            }),
          },
        }}
      >
        <Box>
          <OutlinedInput
            onChange={handleSearchChange}
            size="small"
            sx={{
              width: "100%",
            }}
          />
        </Box>
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
          <MenuItem key={_index} value={getOptionValueWithOptionField(option)}>
            {getOptionLabelWithOptionField(option)}
          </MenuItem>
        ))}
      </Select>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};
export default memo(SelectField);

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: "4px",
  maxHeight: "inherit",
  background: alpha(theme.palette.grey[300], 0.1),
  borderColor: alpha(theme.palette.grey[600], 0.6),
  "& .MuiChip-label": {
    color: theme.palette.grey[800],
  },
}));
