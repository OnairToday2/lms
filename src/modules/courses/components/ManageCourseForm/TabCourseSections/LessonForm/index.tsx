import RHFTextField from "@/shared/ui/form/RHFTextField";
import { useUpsertCourseFormContext } from "../../UpsertCourseFormContainer";
import RHFRichEditor from "@/shared/ui/form/RHFRichEditor";
import DocumentsFields from "./DocumentsFields";
import { useLibraryStore } from "@/modules/library/store/libraryProvider";
interface LessionFormProps {
  lessonIndex: number;
  sectionIndex: number;
}
const LessionForm: React.FC<LessionFormProps> = ({ lessonIndex, sectionIndex }) => {
  const { control } = useUpsertCourseFormContext();
  const openLibrary = useLibraryStore((state) => state.openLibrary);

  // const {field} = useController({control, name: ""})

  console.log(lessonIndex, sectionIndex);
  return (
    <div className="lession-form flex flex-col gap-6">
      <RHFTextField
        control={control}
        name={`sections.${sectionIndex}.lessons.${lessonIndex}.title`}
        label="Tiêu đề"
        required
        placeholder="Nhập tên bài giảng"
      />
      <RHFRichEditor
        control={control}
        label="Mô tả"
        name={`sections.${sectionIndex}.lessons.${lessonIndex}.content`}
        required
        placeholder="Nội dung bài giảng"
      />
      <DocumentsFields label="Tài liệu" control={control} lessonIndex={lessonIndex} sectionIndex={sectionIndex} />
    </div>
  );
};
export default LessionForm;
