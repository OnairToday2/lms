"use client";
import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { ClassRoom } from "../../../classroom-form.schema";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import { TrashIcon1 } from "@/shared/assets/icons";
import { memo, useCallback, useLayoutEffect } from "react";
import { Button, Divider, IconButton, Typography } from "@mui/material";
import PlusIcon from "@/shared/assets/icons/PlusIcon";

const MAX_FIELD_COUNT = 4;
const MIN_FIELD_COUNT = 2;

interface WhiesFieldsProps {
  className?: string;
}
const WhiesFields: React.FC<WhiesFieldsProps> = ({ className }) => {
  const { control, trigger, setValue } = useFormContext<ClassRoom>();

  const {
    fields: whiesFields,
    remove,
    append,
  } = useFieldArray({
    control,
    name: "whies",
    keyName: "_whiesId",
  });

  const handleAddMore = useCallback(async () => {
    const fieldCount = whiesFields.length;
    if (fieldCount > 0) {
      const isValidField = await trigger("whies");
      if (!isValidField) return;
    }
    append({ description: "" });
  }, [whiesFields]);

  return (
    <div className={className}>
      {whiesFields.length ? (
        <>
          <div>
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
              Tạo ít nhất {MIN_FIELD_COUNT} lợi ích và tối đa {MAX_FIELD_COUNT}.
            </Typography>
          </div>
          <div className="pt-4 flex flex-col gap-4">
            {whiesFields.map((field, _index) => (
              <div className="for-whom-field flex" key={field._whiesId}>
                <RHFTextField
                  key={field._whiesId}
                  control={control}
                  name={`whies.${_index}.description`}
                  placeholder={`Đối tượng ${_index + 1}`}
                />

                <IconButton
                  size="small"
                  className="p-0 bg-transparent mt-[2px]"
                  disabled={_index === 0}
                  {...(_index !== 0 ? { onClick: () => remove(_index) } : undefined)}
                >
                  <TrashIcon1 className="w-4 h-4" />
                </IconButton>
              </div>
            ))}
          </div>
        </>
      ) : null}
      {whiesFields.length < MAX_FIELD_COUNT ? (
        <>
          <div className="h-6"></div>
          <Divider>
            <Button onClick={handleAddMore} startIcon={<PlusIcon />} variant="outlined" size="small">
              Thêm mới
            </Button>
          </Divider>
        </>
      ) : null}
    </div>
  );
};
export default memo(WhiesFields);
