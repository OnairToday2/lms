"use client";
import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { ClassRoom } from "../../../classroom-form.schema";
import { CloudUploadIcon, TrashIcon1 } from "@/shared/assets/icons";
import { useCallback } from "react";
import { Button, Divider, IconButton, Typography } from "@mui/material";
import Uploader from "@/shared/ui/Uploader";
import ResourceAccordion from "../AccordionResourceItem";
import PlusIcon from "@/shared/assets/icons/PlusIcon";

interface DocumentFieldsProps {
  className?: string;
}
const DocumentFields: React.FC<DocumentFieldsProps> = ({ className }) => {
  const { control, setValue, getValues, trigger } = useFormContext<ClassRoom>();
  const {
    fields: docFields,
    remove,
    move,
    update,
    append,
  } = useFieldArray({
    control,
    name: "docs",
    keyName: "_docs",
  });

  return (
    <div className={className}>
      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 3 }}>
        * Hỗ trợ tài liệu có dung lượng tối đa 5MB.
      </Typography>
      <Uploader buttonUpload={<Button startIcon={<CloudUploadIcon />}>Tải lên</Button>} />
      {docFields.length ? (
        <div className="flex flex-col gap-4">
          {docFields.map((field, _index) => (
            <div className="faq-field" key={field._docs}>
              <div className="flex justify-between items-center mb-2">
                <Typography className="font-bold">Câu {_index + 1}</Typography>
                {_index !== 0 ? (
                  <IconButton
                    size="small"
                    className="p-0 bg-transparent"
                    {...(_index !== 0 ? { onClick: () => remove(_index) } : undefined)}
                  >
                    <TrashIcon1 className="w-4 h-4" />
                  </IconButton>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
export default DocumentFields;
