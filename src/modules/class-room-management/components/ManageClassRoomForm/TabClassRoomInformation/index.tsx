"use client";
import TextEditor from "@/shared/ui/form/RHFRichEditor";
import RHFTextField from "@/shared/ui/form/RHFTextField";
import { FormLabel, Typography } from "@mui/material";
import { type ClassRoom } from "../../classroom-form.schema";
interface TabClassRoomInformationProps {}
import { useFormContext } from "react-hook-form";
import { memo } from "react";
import ThumbnailUploader, { ThumbnailUploaderProps } from "./ThumbailUploader";
import ClassRoomSlugField from "./ClassRoomSlugField";
import ClassFieldSelector from "./ClassFieldSelector";
import ClassHashTagSelector from "./ClassHashTagSelector";
import GalleriesUploader, { GalleriesUploaderProps } from "./GalleriesUploader";

const TabClassRoomInformation: React.FC<TabClassRoomInformationProps> = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<ClassRoom>();

  const handleChangeThumbnail: ThumbnailUploaderProps["onChange"] = (path) => {
    const fullPath = process.env.NEXT_PUBLIC_STORAGE_URL ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${path}` : path;
    setValue("thumbnailUrl", fullPath);
  };

  const handleChangeGalleries: GalleriesUploaderProps["onChange"] = (paths) => {
    const currectPath = paths.map((path) =>
      process.env.NEXT_PUBLIC_STORAGE_URL ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${path}` : path,
    );
    setValue("galleries", currectPath);
  };

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

        <ThumbnailUploader
          label="Ảnh bìa đại diện"
          subTitle="Hình ảnh đại diện cho lớp học của bạn"
          description={
            <div className="flex flex-wrap gap-2 items-center mb-2">
              <Typography className="text-xs">
                Kích thước chuẩn: <strong>1152 x 480 px (21:9)</strong>
              </Typography>
              <span className="w-1 h-1 rounded-full bg-slate-500"></span>
              <Typography className="text-xs">File đuôi jpg, png</Typography>
            </div>
          }
          required
          onChange={handleChangeThumbnail}
          error={!!errors.thumbnailUrl}
          helperText={errors?.thumbnailUrl?.message}
        />

        <TextEditor label="Nội dung khóa học" control={control} name="description" required />

        <ClassFieldSelector control={control} />
        <ClassHashTagSelector control={control} />

        <GalleriesUploader
          label="Thư viện ảnh"
          description={
            <div className="flex flex-wrap gap-2 items-center">
              <Typography className="text-xs">
                Kích thước chuẩn: <strong>1280 x 720 (16:9)</strong>
              </Typography>
              <span className="w-1 h-1 rounded-full bg-slate-500"></span>
              <Typography className="text-xs">File đuôi jpg, png</Typography>
            </div>
          }
          onChange={handleChangeGalleries}
          error={!!errors.galleries}
          helperText={errors?.galleries?.message}
        />
      </div>

      <div className="block bg-white rounded-xl p-6">
        <FormLabel component="div" className="mb-6 inline-block text-base">
          Nhóm cộng đồng
        </FormLabel>
        <div className="flex flex-col gap-6">
          <RHFTextField control={control} label="Tên nhóm" placeholder="Tên nhóm" name="communityInfo.name" />
          <RHFTextField control={control} label="Dường dẫn" placeholder="Dường dẫn" name="communityInfo.url" />
        </div>
      </div>
    </div>
  );
};
export default memo(TabClassRoomInformation);
