import Uploader, { UploaderProps } from "@/shared/ui/Uploader";
import useUpload from "@/modules/class-room-management/hooks/useUpload";
import { FormHelperText, FormLabel, IconButton, Typography } from "@mui/material";
import { ClassRoom } from "../../classroom-form.schema";
import { Control, useController } from "react-hook-form";
import Image from "next/image";
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
    let fileUpload = Array.isArray(file) ? file[0] : file;

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
      {field.value ? (
        <div className="preview-url aspect-[21/9] relative w-full overflow-hidden rounded-xl">
          <Image src={field.value} alt="thumbnail" fill className="w-full h-full object-cover" />
          <IconButton
            sx={{ width: "2rem", height: "2rem", position: "absolute", right: "0.5rem", top: "0.5rem" }}
            onClick={handleRemoveThumbnail}
          >
            <CloseIcon className="w-4 h-4" />
          </IconButton>
        </div>
      ) : (
        <Uploader
          accept={{ images: [".jpg", ".jpeg", ".png"] }}
          onChange={handleUploadImage}
          multiple={false}
          maxCount={5}
        />
      )}
      {error?.message ? <FormHelperText error={!!error}>{error.message}</FormHelperText> : null}
    </div>
  );
};
export default ThumbnailUploader;
