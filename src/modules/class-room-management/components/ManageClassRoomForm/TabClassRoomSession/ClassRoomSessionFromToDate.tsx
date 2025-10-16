import RHFDateTimePicker from "@/shared/ui/form/RHFDateTimePicker";
import { Control, useController } from "react-hook-form";
import { ClassRoom } from "../../classroom-form.schema";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";
interface ClassRoomSessionFromToDateProps {
  control: Control<ClassRoom>;
  index: number;
}
const ClassRoomSessionFromToDate: React.FC<ClassRoomSessionFromToDateProps> = ({ control, index }) => {
  const { field: startDateField } = useController({ control: control, name: `classRoomSessions.${index}.startDate` });

  const { field: endDateField } = useController({ control: control, name: `classRoomSessions.${index}.endDate` });

  console.log(endDateField.value, startDateField.value);

  const handleChange = () => {
    endDateField.onChange(dayjs().add(7, "days").toISOString());
  };
  useEffect(() => {}, [endDateField.value]);
  return (
    <div className="flex gap-4">
      <RHFDateTimePicker
        control={control}
        name={`classRoomSessions.${index}.startDate`}
        label="Thời gian bắt đầu"
        minDate={dayjs()}
        maxDate={endDateField?.value ? dayjs(endDateField.value) : undefined}
        required
      />
      <RHFDateTimePicker
        control={control}
        name={`classRoomSessions.${index}.endDate`}
        label="Thời gian kết thúc"
        minDate={startDateField.value ? dayjs(startDateField.value) : undefined}
        required
      />
    </div>
  );
};
export default ClassRoomSessionFromToDate;
