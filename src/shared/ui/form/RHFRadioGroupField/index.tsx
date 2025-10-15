import React, { memo, useId } from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

interface RHFRadioGroupFieldProps<T extends FieldValues> {
  className?: string;
  label?: React.ReactNode;
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  options: { value: string; label: string }[];
  direction?: "vertical" | "horizontal";
}
const RHFRadioGroupField = <T extends FieldValues>({
  className,
  control,
  name,
  label,
  options,
  required,
  direction,
}: RHFRadioGroupFieldProps<T>) => {
  const fieldId = useId();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl className={className} error={!!error}>
          {label ? (
            <FormLabel htmlFor={fieldId}>
              {label}
              {required ? <span className="ml-1">*</span> : null}
            </FormLabel>
          ) : null}
          <RadioGroup
            row={direction === "horizontal"}
            aria-labelledby="Radio"
            {...field}
            name="radio-buttons-group"
          >
            {options.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio />}
                label={opt.label}
                sx={{
                  ".MuiTypography-root": {
                    fontSize: "0.875rem",
                  },
                }}
              />
            ))}
          </RadioGroup>
          {error?.message ? (
            <FormHelperText error={!!error}>{error.message}</FormHelperText>
          ) : null}
        </FormControl>
      )}
    />
  );
};
export default RHFRadioGroupField;
