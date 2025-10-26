import { useGetClassHashTagQuery } from "@/modules/class-room-management/operation/query";
import { Control } from "react-hook-form";
import { ClassRoom } from "../../classroom-form.schema";
import RHFSelectField from "@/shared/ui/form/RHFSelectField";
interface ClassHashTagSelectorProps {
  control: Control<ClassRoom>;
}
const ClassHashTagSelector: React.FC<ClassHashTagSelectorProps> = ({ control }) => {
  const { data: hashTagListData, isPending } = useGetClassHashTagQuery();
  const hashTags = hashTagListData?.data || [];

  return (
    <RHFSelectField
      label="Hash tags"
      control={control}
      name="hashTags"
      placeholder="Hash tags"
      optionField={{
        value: "id",
        label: "name",
      }}
      options={hashTags}
    />
  );
};
export default ClassHashTagSelector;
