"use client";
import { memo, useCallback } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { type Assignment, type Question } from "../../assignment-form.schema";
import { Button, Divider, FormControl, FormLabel, IconButton, MenuItem, Select, Typography } from "@mui/material";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import PlusIcon from "@/shared/assets/icons/PlusIcon";
import { TrashIcon1 } from "@/shared/assets/icons";

interface TabAssignmentContentProps {}

const getQuestionInitData = (): Question => {
  return {
    type: "file",
    label: "",
  };
};

const TabAssignmentContent: React.FC<TabAssignmentContentProps> = () => {
  const { control, trigger } = useFormContext<Assignment>();

  const {
    fields: questionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "questions",
    keyName: "_questionId",
  });

  const handleAddQuestion = useCallback(async () => {
    const questionCount = questionFields.length;

    if (questionCount > 0) {
      const isValidAllFields = await trigger("questions");
      if (!isValidAllFields) return;
    }
    append(getQuestionInitData());
  }, [questionFields, trigger, append]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl p-6">
        <div className="mb-4">
          <Typography variant="h6" className="text-base font-semibold">
            Danh sách câu hỏi
          </Typography>
          <Typography className="text-xs text-gray-600 mt-1">
            Tạo ít nhất 1 câu hỏi cho bài kiểm tra.
          </Typography>
        </div>

        {questionFields.length > 0 && (
          <div className="flex flex-col gap-4 mb-6">
            {questionFields.map((field, index) => (
              <div key={field._questionId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <Typography className="text-sm font-medium text-gray-700">Câu hỏi {index + 1}</Typography>
                  <IconButton
                    size="small"
                    className="p-0 bg-transparent"
                    onClick={() => remove(index)}
                    disabled={questionFields.length === 1}
                  >
                    <TrashIcon1 className="w-4 h-4" />
                  </IconButton>
                </div>

                <div className="flex flex-col gap-4">
                  <FormControl fullWidth>
                    <FormLabel className="text-sm mb-2">
                      Loại câu hỏi <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select value="file" disabled size="small">
                      <MenuItem value="file">File</MenuItem>
                    </Select>
                  </FormControl>

                  <RHFTextField
                    control={control}
                    name={`questions.${index}.label`}
                    label="Nội dung câu hỏi"
                    placeholder="Nhập nội dung câu hỏi"
                    required
                    multiline
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Divider>
          <Button onClick={handleAddQuestion} startIcon={<PlusIcon />} variant="outlined" size="small">
            Thêm câu hỏi
          </Button>
        </Divider>
      </div>
    </div>
  );
};

export default memo(TabAssignmentContent);

