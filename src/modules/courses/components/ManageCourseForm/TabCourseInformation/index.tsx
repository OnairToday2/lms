"use client";
import { memo } from "react";
import TextEditor from "@/shared/ui/form/RHFRichEditor";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import { Typography } from "@mui/material";
import { type UpsertCourseFormData } from "../../upsert-course.schema";
import { useFormContext } from "react-hook-form";
import ThumbnailUploader from "./fields/ThumbailUploader";
import SlugField from "./fields/SlugField";
import DocumentFields from "./fields/DocumentFields";
import CategorySelector from "./fields/CategorySelector";
import TeacherSelector from "./fields/TeacherSelector";

interface TabCourseInformationProps {
  className?: string;
}
const TabCourseInformation: React.FC<TabCourseInformationProps> = () => {
  const { control } = useFormContext<UpsertCourseFormData>();

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl p-6 flex flex-col gap-6">
        <div>
          <RHFTextField
            control={control}
            label="Tên môn học"
            placeholder="Nhập tên môn học"
            name="title"
            required
            helpText={<Typography className="text-xs text-gray-600 text-right">Tối đa 200 ký tự</Typography>}
          />
          <div className="h-3"></div>
          <SlugField control={control} />
        </div>
        <TextEditor label="Nội dung khóa học" control={control} name="description" required />
        <CategorySelector control={control} />
        <ThumbnailUploader
          label="Ảnh bìa môn học"
          subTitle="Hình ảnh đại diện cho môn học của bạn"
          control={control}
          description={
            <div className="flex flex-wrap gap-2 items-center mb-2">
              <Typography className="text-xs">
                Kích thước chuẩn: <strong>1920 x 1080 px (16:9)</strong>
              </Typography>
              <span className="w-1 h-1 rounded-full bg-slate-500"></span>
              <Typography className="text-xs">File đuôi jpg, png</Typography>
            </div>
          }
        />
      </div>
      <TeacherSelector className="bg-white p-6 rounded-xl" />
      <DocumentFields className="bg-white p-6 rounded-xl" />
    </div>
  );
};
export default memo(TabCourseInformation);
