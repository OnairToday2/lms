import Uploader, { UploaderProps } from "@/shared/ui/Uploader";
import useUpload from "@/modules/class-room-management/hooks/useUpload";
import { FormHelperText, FormLabel, IconButton, Typography } from "@mui/material";
import { ClassRoom } from "../../../classroom-form.schema";
import { Control, useController } from "react-hook-form";
import Image from "next/image";
import { cn } from "@/utils";
import { CloseIcon } from "@/shared/assets/icons";

export interface ThumbnailUploaderProps {
  onChange?: (url: string) => void;
  control: Control<ClassRoom>;
  label?: string;
  subTitle?: string;
  description?: React.ReactNode;
}
const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({ control, onChange, label, subTitle, description }) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name: "thumbnailUrl" });
  const { onUploadSingle } = useUpload();

  const handleUploadImage: UploaderProps["onChange"] = (file) => {
    const fileUpload = Array.isArray(file) ? file[0] : file;

    if (!fileUpload) return;

    onUploadSingle(fileUpload, {
      onSuccess: (response) => {
        if (response.data) {
          const fullPath = process.env.NEXT_PUBLIC_STORAGE_URL
            ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${response.data.fullPath}`
            : response.data.fullPath;
          field.onChange(fullPath);
        }
      },
    });
  };
  const handleRemoveThumbnail = () => {
    field.onChange("");
  };
  return (
    <div>
      <FormLabel component="div" className="mb-2 inline-block">
        {label}
        <span className="text-red-600 ml-1">*</span>
      </FormLabel>
      {subTitle ? <Typography className="text-xs mb-4">{subTitle}</Typography> : null}
      {description ? <div className="description">{description}</div> : null}
      <div
        className={cn(
          "thumbnail-wraper",
          "aspect-21/9 w-[480px] bg-gray-100 rounded-xl border border-dashed border-gray-300",
          "flex items-center justify-center",
        )}
      >
        {field.value && (
          <div className="preview-url aspect-21/9 relative w-full overflow-hidden rounded-xl">
            <Image src={field.value} alt="thumbnail" fill className="w-full h-full object-cover" />
            <IconButton
              sx={{ width: "2rem", height: "2rem", position: "absolute", right: "0.5rem", top: "0.5rem" }}
              onClick={handleRemoveThumbnail}
            >
              <CloseIcon className="w-4 h-4" />
            </IconButton>
          </div>
        )}
        <Uploader
          accept={{ images: [".jpg", ".jpeg", ".png"] }}
          onChange={handleUploadImage}
          multiple={false}
          hidePreviewThumbnail
          buttonUpload={
            <div className="text-center">
              <Image
                src="/assets/icons/upload-cloud.svg"
                width={80}
                height={40}
                alt="upload icon"
                className="mb-3 mx-auto"
              />
              <Typography
                sx={(theme) => ({
                  color: theme.palette.primary["dark"],
                  backgroundColor: theme.palette.primary["lighter"],
                  fontWeight: "bold",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                })}
              >
                Tải ảnh lên
              </Typography>
            </div>
          }
          className={cn({
            "opacity-0 pointer-events-none hidden": !!field.value,
          })}
        />
      </div>
      {error?.message ? <FormHelperText error={!!error}>{error.message}</FormHelperText> : null}
    </div>
  );
};
export default ThumbnailUploader;
