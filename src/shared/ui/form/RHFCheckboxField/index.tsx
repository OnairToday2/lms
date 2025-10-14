import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useId } from "react";
import type { Control, PathValue, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

interface RHFCheckboxFieldProps<T extends FieldValues> {
  className?: string;
  label?: React.ReactNode;
  control: Control<T>;
  name: Path<T>;
}
const RHFCheckboxField = <T extends FieldValues>({
  className,
  control,
  name,
  label,
}: RHFCheckboxFieldProps<T>) => {
  const fieldId = useId();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl className={className} error={!!error}>
          <FormControlLabel
            {...field}
            control={<Checkbox />}
            name={name}
            label={label}
            sx={{
              ".MuiTypography-root": {
                fontSize: "0.875rem",
              },
            }}
          />
          {error?.message ? (
            <FormHelperText error={!!error}>{error.message}</FormHelperText>
          ) : null}
        </FormControl>
      )}
    />
  );
};
export default RHFCheckboxField;
