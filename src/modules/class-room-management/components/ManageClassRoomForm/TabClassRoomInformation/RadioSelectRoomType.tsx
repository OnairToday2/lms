import RHFRadioGroupField from "@/shared/ui/form/RHFRadioGroupField";
import { ClassRoom } from "../../classroom-form.schema";
import { Control } from "react-hook-form";

interface RadioSelectRoomTypeProps {
  control: Control<ClassRoom>;
}
const RadioSelectRoomType: React.FC<RadioSelectRoomTypeProps> = ({ control }) => {
  return (
    <RHFRadioGroupField
      control={control}
      name="roomType"
      direction="horizontal"
      options={[
        { label: "Lớp học đơn", value: "single" },
        { label: "Lớp học chuỗi", value: "multiple" },
      ]}
      label="Loại lớp học"
    />
  );
};
export default RadioSelectRoomType;
