"use client";
import TextEditor from "@/shared/ui/form/RHFRichEditor";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import { FormLabel, Typography } from "@mui/material";
import { type ClassRoom } from "../../classroom-form.schema";
import RHFSelectField from "@/shared/ui/form/RHFSelectField";
interface TabClassRoomInformationProps {}
import { useFormContext } from "react-hook-form";
import { memo } from "react";
import ThumbnailUploader from "./ThumbailUploader";
import ClassRoomSlugField from "./ClassRoomSlugField";
import ClassFieldSelector from "./ClassFieldSelector";
import ClassHashTagSelector from "./ClassHashTagSelector";

const TabClassRoomInformation: React.FC<TabClassRoomInformationProps> = () => {
  const { control } = useFormContext<ClassRoom>();

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl p-6 flex flex-col gap-6">
        <div>
          <RHFTextField
            control={control}
            label="Tên lớp học"
            placeholder="Tên lớp học"
            name="title"
            required
            helpText={<Typography className="text-xs text-gray-600 text-right">Tối đa 100 ký tự</Typography>}
          />
          <div className="h-3"></div>
          <ClassRoomSlugField control={control} />
        </div>
        <div>
          <FormLabel component="div" className="mb-2 inline-block">
            Ảnh bìa đại diện <span className="text-red-600">*</span>
          </FormLabel>
          <Typography className="text-xs mb-4">Hình ảnh đại diện cho lớp học của bạn</Typography>
          <div className="flex flex-wrap gap-2 items-center mb-2">
            <Typography className="text-xs">
              Kích thước chuẩn: <strong>1152 x 480 px (21:9)</strong>
            </Typography>
            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
            <Typography className="text-xs">File đuôi jpg, png</Typography>
          </div>
          <ThumbnailUploader />
        </div>
        <TextEditor label="Nội dung khóa học" control={control} name="description" required />

        <ClassFieldSelector control={control} />
        <ClassHashTagSelector control={control} />

        <div className="galleries">
          <FormLabel component="div" className="mb-2 inline-block">
            Thư viện ảnh
          </FormLabel>
          <div className="flex flex-col gap-1 mb-2">
            <div className="flex flex-wrap gap-2 items-center">
              <Typography className="text-xs">
                Kích thước chuẩn: <strong>1152 x 480 px (21:9)</strong>
              </Typography>
              <span className="w-1 h-1 rounded-full bg-slate-500"></span>
              <Typography className="text-xs">File đuôi jpg, png</Typography>
            </div>
          </div>
          <div className="gallery-list">
            <ThumbnailUploader />
          </div>
        </div>
      </div>

      <div className="block bg-white rounded-xl p-6">
        <FormLabel component="div" className="mb-3 inline-block">
          Nhóm cộng đồng
        </FormLabel>
        <div className="flex gap-4">
          <RHFTextField control={control} label="Tên nhóm" placeholder="Tên nhóm" name="communityInfo.name" />
          <RHFTextField control={control} label="Dường dẫn" placeholder="Dường dẫn" name="communityInfo.url" />
        </div>
      </div>
    </div>
  );
};
export default memo(TabClassRoomInformation);
