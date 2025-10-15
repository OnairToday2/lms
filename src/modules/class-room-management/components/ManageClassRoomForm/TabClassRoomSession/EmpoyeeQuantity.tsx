"use client";
import { FormLabel } from "@mui/material";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import { Control, useController } from "react-hook-form";
import { ClassRoom, ClassRoomSession } from "../../classroom-form.schema";
import CheckboxField from "@/shared/ui/form/CheckboxField";
import { useState } from "react";
interface EmployeeQuantityProps {
  control: Control<ClassRoom>;
  fieldIndex: number;
}
const EmployeeQuantity = ({ control, fieldIndex }: EmployeeQuantityProps) => {
  const { field, fieldState, formState } = useController({
    control,
    name: `classRoomSessions.${fieldIndex}.limitPerson`,
  });
  const [isUnlimited, setIsUnlimited] = useState(false);
  const handleSetUnlimited = () => {
    setIsUnlimited((prev) => !prev);
    field.onChange("");
  };
  return (
    <div>
      <FormLabel component="div">Số lượng tham dự</FormLabel>
      <div className="flex items-center gap-4">
        <CheckboxField
          value={isUnlimited}
          onChange={handleSetUnlimited}
          label="Không giới hạn"
        />

        <RHFTextField
          name={`classRoomSessions.${fieldIndex}.limitPerson`}
          control={control}
          placeholder="Số lượng"
          type="number"
          disabled={isUnlimited}
        />
      </div>
    </div>
  );
};
export default EmployeeQuantity;
