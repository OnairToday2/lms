import RHFTextField from "@/shared/ui/form/RHFTextField";
import { useUpsertCourseFormContext } from "../UpsertCourseFormContainer";
import { useController } from "react-hook-form";
import RHFRichEditor from "@/shared/ui/form/RHFRichEditor";
interface LessionFormProps {
  lessionIndex: number;
  sectionIndex: number;
}
const LessionForm: React.FC<LessionFormProps> = ({ lessionIndex, sectionIndex }) => {
  const { control } = useUpsertCourseFormContext();
  // const {field} = useController({control, name: ""})

  console.log(lessionIndex, sectionIndex);
  return (
    <div className="lession-form flex flex-col gap-6">
      <RHFTextField
        control={control}
        name={`sections.${sectionIndex}.lessions.${lessionIndex}.title`}
        label="Tiêu đề"
        required
        placeholder="Nhập tên bài giảng"
      />
      <RHFRichEditor
        control={control}
        label="Mô tả"
        name={`sections.${sectionIndex}.lessions.${lessionIndex}.content`}
        required
        placeholder="Nội dung bài giảng"
      />
    </div>
  );
};
export default LessionForm;
