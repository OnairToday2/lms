"use client";
import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { ClassRoom } from "../../classroom-form.schema";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import { HelpIcon, TrashIcon1 } from "@/shared/assets/icons";
import RHFTextAreaField from "@/shared/ui/form/RHFTextAreaField";
import { useCallback } from "react";
import ResourceFieldBox from "./ResourceFieldBox";
import { IconButton, Typography } from "@mui/material";
interface FAQsFieldsProps {}
const FAQsFields: React.FC<FAQsFieldsProps> = () => {
  const { control, setValue, getValues, trigger } = useFormContext<ClassRoom>();
  const {
    fields: faqFields,
    remove,
    move,
    update,
    append,
  } = useFieldArray({
    control,
    name: "faqs",
    keyName: "_faqId",
    rules: {
      minLength: 1,
    },
  });

  const handleAddFaqItem = useCallback(async () => {
    const faqCount = getValues("faqs").length;

    if (faqCount > 0) {
      const isValidAllFields = await trigger("faqs");
      if (!isValidAllFields) return;
    }

    // const nextId = `field-${faqCount + 1}`;

    append({ answer: "", question: "" });
  }, []);

  return (
    <ResourceFieldBox
      icon={<HelpIcon />}
      title="Câu hỏi thường gặp"
      onClick={handleAddFaqItem}
      className="bg-white p-6 rounded-xl"
    >
      {faqFields.map((field, _index) => (
        <div className="faq-field" key={field._faqId}>
          <div className="flex justify-between items-center mb-2">
            <Typography className="font-bold">Câu {_index + 1}</Typography>
            <IconButton size="small" className="p-0 bg-transparent" onClick={() => remove(_index)}>
              <TrashIcon1 className="w-4 h-4" />
            </IconButton>
          </div>
          <div className="flex flex-col gap-4">
            <RHFTextField name={`faqs.${_index}.question`} placeholder="Câu hỏi" control={control} />
            <RHFTextAreaField name={`faqs.${_index}.answer`} placeholder="Câu trả lời" control={control} />
          </div>
        </div>
      ))}
    </ResourceFieldBox>
  );
};
export default FAQsFields;
