import Uploader, { UploaderProps } from "@/shared/ui/Uploader";
import useUpload from "@/modules/class-room-management/hooks/useUpload";
import { FormHelperText, FormLabel, Typography } from "@mui/material";
export interface ThumbnailUploaderProps {
  onChange?: (url: string) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  subTitle?: string;
  description?: React.ReactNode;
}
const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  onChange,
  error,
  helperText,
  label,
  required,
  subTitle,
  description,
}) => {
  const { onUploadSingle } = useUpload();

  const handleUploadImage: UploaderProps["onChange"] = (file) => {
    let fileUpload = Array.isArray(file) ? file[0] : file;

    if (!fileUpload) return;

    onUploadSingle(fileUpload, {
      onSuccess: (response) => {
        if (response.data) {
          onChange?.(response.data.fullPath);
        }
      },
    });
  };
  return (
    <div>
      <FormLabel component="div" className="mb-2 inline-block">
        {label}
        {required ? <span className="text-red-600 ml-1">*</span> : null}
      </FormLabel>
      {subTitle ? <Typography className="text-xs mb-4">{subTitle}</Typography> : null}
      {description ? <div className="description">{description}</div> : null}

      <Uploader
        accept={{ images: [".jpg", ".jpeg", ".png"] }}
        onChange={handleUploadImage}
        multiple={false}
        maxCount={5}
      />
      {helperText ? <FormHelperText error={error}>{helperText}</FormHelperText> : null}
    </div>
  );
};
export default ThumbnailUploader;
