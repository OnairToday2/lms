"use client";
import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import { Editor } from "../Editor";
import {
  Control,
  Controller,
  Path,
  PathValue,
  FieldValues,
} from "react-hook-form";
import { useId } from "react";

interface RHFRichEditorProps<T extends FieldValues> {
  className?: string;
  label?: React.ReactNode;
  placeholder?: React.ReactNode | string;
  control: Control<T>;
  name: Path<T>;
  type?: "text";
  defaultValue?: PathValue<T, Path<T>>;
  required?: boolean;
}
const RHFRichEditor = <T extends FieldValues>({
  label,
  control,
  defaultValue,
  name,
  className,
  required,
}: RHFRichEditorProps<T>) => {
  const fieldId = useId();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormControl className={className} error={!!error}>
          {label ? (
            <FormLabel htmlFor={fieldId}>
              {label}
              {required ? <span className="ml-1">*</span> : null}
            </FormLabel>
          ) : null}
          <Editor {...field} error={!!error} helperText={error?.message} />
        </FormControl>
      )}
    />
  );
};

export default RHFRichEditor;
