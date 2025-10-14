import { useGetClassFieldQuery } from "@/modules/class-room-management/hooks/useGetClassField";
import { Control } from "react-hook-form";
import { ClassRoom } from "../../classroom-form.schema";
import RHFSelectField from "@/shared/ui/form/RHFSelectField";
interface ClassFieldSelectorProps {
  control: Control<ClassRoom>;
}
const ClassFieldSelector: React.FC<ClassFieldSelectorProps> = ({ control }) => {
  const { data: fieldListData, isPending } = useGetClassFieldQuery();

  const fieldList = fieldListData?.data || [];
  return (
    <RHFSelectField
      label="Lĩnh vực"
      control={control}
      name="classRoomField"
      placeholder="Chọn lĩnh vực"
      required
      optionField={{
        value: "id",
        label: "name",
      }}
      options={fieldList}
    />
  );
};
export default ClassFieldSelector;
