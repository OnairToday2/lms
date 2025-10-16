"use client";
import { FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from "@mui/material";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import { Control, useWatch } from "react-hook-form";
import { ClassRoom } from "../../classroom-form.schema";
import { Controller } from "react-hook-form";
interface EmployeeQuantityProps {
  control: Control<ClassRoom>;
  fieldIndex: number;
}
type QuantityType = "unlimit" | "limit";
const EmployeeQuantity = ({ control, fieldIndex }: EmployeeQuantityProps) => {
  const watchIsUnlimited = useWatch({ control, name: `classRoomSessions.${fieldIndex}.isUnlimited` });
  return (
    <div>
      <FormLabel component="div">Số lượng tham dự</FormLabel>
      <RadioGroup row={true} className="gap-6">
        <Controller
          control={control}
          name={`classRoomSessions.${fieldIndex}.isUnlimited`}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControlLabel
              control={<Radio />}
              value={true}
              checked={value === true}
              onChange={() => onChange(true)}
              label="Không giới hạn"
              sx={{
                ".MuiTypography-root": {
                  fontSize: "0.875rem",
                },
              }}
            />
          )}
        />
        <div className="flex items-center whitespace-nowrap gap-1">
          <Controller
            control={control}
            name={`classRoomSessions.${fieldIndex}.isUnlimited`}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControlLabel
                control={<Radio />}
                value={false}
                checked={value === false}
                onChange={() => onChange(false)}
                label="Giới hạn"
                sx={{
                  ".MuiTypography-root": {
                    fontSize: "0.875rem",
                  },
                }}
              />
            )}
          />
          <RHFTextField
            name={`classRoomSessions.${fieldIndex}.limitPerson`}
            control={control}
            placeholder="Số lượng"
            type="number"
            disabled={watchIsUnlimited}
            className="max-w-30"
          />
          <Typography>học viên</Typography>
        </div>
      </RadioGroup>
    </div>
  );
};
export default EmployeeQuantity;
