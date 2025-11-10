import RHFTextField from "@/shared/ui/form/RHFTextField";
import { useUpsertCourseFormContext } from "../../UpsertCourseFormContainer";
import RHFRichEditor from "@/shared/ui/form/RHFRichEditor";
import DocumentsFields from "./DocumentsFields";
import { useLibraryStore } from "@/modules/library/store/libraryProvider";
import MainResourceField from "./MainResourceField";
import { useController } from "react-hook-form";
import { Typography } from "@mui/material";
interface LessionFormProps {
  lessonIndex: number;
  sectionIndex: number;
}
const LessionForm: React.FC<LessionFormProps> = ({ lessonIndex, sectionIndex }) => {
  const { control, setValue, getValues } = useUpsertCourseFormContext();
  const openLibrary = useLibraryStore((state) => state.openLibrary);
  const lessonType = getValues(`sections.${sectionIndex}.lessons.${lessonIndex}.lessonType`);
  const mainResource = getValues(`sections.${sectionIndex}.lessons.${lessonIndex}.mainResource`);
  // const {field: {value, onChange}} = useController({control, name: `sections.${sectionIndex}.lessons.${lessonIndex}.mainResource`})
  // const {field} = useController({control, name: ""})

  console.log(lessonIndex, sectionIndex);
  return (
    <div>
      {lessonType === "file" ? (
        <Typography>PDF</Typography>
      ) : lessonType === "video" ? (
        <Typography>Video</Typography>
      ) : lessonType === "assessment" ? (
        <Typography>Assessment</Typography>
      ) : (
        <Typography>Unknown</Typography>
      )}
      <div className="lession-form flex flex-col gap-6">
        <RHFTextField
          control={control}
          name={`sections.${sectionIndex}.lessons.${lessonIndex}.title`}
          label="Tiêu đề"
          required
          placeholder="Nhập tên bài giảng"
        />
        <MainResourceField label="Tài liệu" control={control} lessonIndex={lessonIndex} sectionIndex={sectionIndex} />
        <RHFRichEditor
          control={control}
          label="Mô tả"
          name={`sections.${sectionIndex}.lessons.${lessonIndex}.content`}
          required
          placeholder="Nội dung bài giảng"
        />
        <DocumentsFields label="Tài liệu" control={control} lessonIndex={lessonIndex} sectionIndex={sectionIndex} />
      </div>
    </div>
  );
};
export default LessionForm;
