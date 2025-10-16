"use client";
import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { ClassRoom } from "../../classroom-form.schema";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import { HelpIcon } from "@/shared/assets/icons";
import RHFTextAreaField from "@/shared/ui/form/RHFTextAreaField";
import { useCallback } from "react";
import ResourceFieldBox from "./ResourceFieldBox";
interface ForWhomFieldsProps {}
const ForWhomFields: React.FC<ForWhomFieldsProps> = () => {
  const { control, setValue } = useFormContext<ClassRoom>();
  const {
    fields: faqFields,
    remove,
    move,
    update,
    append,
  } = useFieldArray({
    control,
    name: "forWhom",
    keyName: "_forWhomId",
    rules: {
      minLength: 1,
    },
  });

  const handleAddMore = useCallback(() => {
    // append({ id: "", title: "", question: "" });
  }, []);
  return (
    <ResourceFieldBox
      icon={<HelpIcon />}
      title="Dành cho ai"
      onClick={handleAddMore}
      className="bg-white p-6 rounded-xl"
    >
      {faqFields.map((field, _index) => (
        <div className="faq-field" key={_index}>
          <div className="flex flex-col gap-4">
            <RHFTextField name={"forWhom"} label="Câu hỏi" placeholder="Câu hỏi" control={control} />
            <RHFTextAreaField
              name={`faqs.${_index}.answer`}
              label="Câu trả lời"
              placeholder="Câu trả lời"
              control={control}
            />
          </div>
        </div>
      ))}
    </ResourceFieldBox>
  );
};
export default ForWhomFields;
