import { useGetClassFieldQuery } from "@/modules/class-room-management/operation/query";
import { Control, useController } from "react-hook-form";
import { ClassRoom } from "../../classroom-form.schema";
import { useCreateClassFieldMutation } from "@/modules/class-room-management/operation/mutation";
import { slugify } from "@/utils/slugify";
import RHFMultipleSelectField from "@/shared/ui/form/RHFMultipleSelectField";
interface ClassFieldSelectorProps {
  control: Control<ClassRoom>;
}
const ClassFieldSelector: React.FC<ClassFieldSelectorProps> = ({ control }) => {
  const {
    field: { onChange, value: classFieldList },
  } = useController({ control, name: "classRoomField" });

  const { data: fieldListData, isPending } = useGetClassFieldQuery();
  const { mutate: createClassField, isPending: isCreateLoading } = useCreateClassFieldMutation();

  const handleEnter = (value: string) => {
    createClassField({
      description: "",
      name: value,
      slug: `${slugify(value)}-${new Date().getTime()}`,
      thumbnail_url: "",
    });
  };
  const fieldList = fieldListData?.data || [];
  const handleRemoveItem = (value: string) => {
    const newClassFields = [...classFieldList].filter((f) => f !== value);
    onChange(newClassFields);
  };
  return (
    <RHFMultipleSelectField
      label="Lĩnh vực"
      control={control}
      name="classRoomField"
      required
      placeholder="Chọn lĩnh vực"
      onInputEnter={handleEnter}
      onRemove={handleRemoveItem}
      isLoading={isCreateLoading}
      options={fieldList.map((it) => ({
        label: it.name || "",
        value: it.id,
      }))}
    />
  );
};
export default ClassFieldSelector;
