"use client";
import React, { useId } from "react";

import { FormControl, FormHelperText, FormLabel, OutlinedInput } from "@mui/material";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import InputNumber from "../InputNumber";

export interface RHFTextFieldProps<T extends FieldValues> {
  className?: string;
  label?: React.ReactNode;
  placeholder?: string;
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  disabled?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  type?: "number" | "text";
  helpText?: React.ReactNode;
}
const RHFTextField = <T extends FieldValues>({
  className,
  control,
  name,
  label,
  placeholder,
  required,
  disabled,
  type = "text",
  endAdornment,
  startAdornment,
  helpText,
}: RHFTextFieldProps<T>) => {
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
              {required ? <span className="ml-1 text-red-600">*</span> : null}
            </FormLabel>
          ) : null}
          <OutlinedInput
            {...field}
            value={type === "number" ? Number.parseInt(field.value) : field.value}
            onChange={(evt) => field.onChange(type === "number" ? Number.parseInt(evt.target.value) : evt.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            size="small"
            id={fieldId}
            type={type}
            sx={{
              background: "white",
            }}
            startAdornment={startAdornment}
            endAdornment={endAdornment}
          />
          {error?.message ? <FormHelperText>{error.message}</FormHelperText> : null}
          {helpText ? <div className="mt-2">{helpText}</div> : null}
        </FormControl>
      )}
    />
  );
};
export default RHFTextField;
