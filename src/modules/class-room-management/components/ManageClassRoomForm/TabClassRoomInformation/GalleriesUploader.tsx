import Uploader, { UploaderProps } from "@/shared/ui/Uploader";
import useUpload from "@/modules/class-room-management/hooks/useUpload";
import { FormHelperText, FormLabel, Typography } from "@mui/material";
export interface GalleriesUploaderProps {
  onChange?: (url: string[]) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  subTitle?: string;
  description?: React.ReactNode;
}
const GalleriesUploader: React.FC<GalleriesUploaderProps> = ({
  onChange,
  error,
  helperText,
  label,
  required,
  subTitle,
  description,
}) => {
  const { onUploadMultiple } = useUpload();

  const handleUploadImage: UploaderProps["onChange"] = (file) => {
    let filesUpload = Array.isArray(file) ? file : [file];

    if (!filesUpload?.length) return;

    onUploadMultiple(filesUpload, {
      onSuccess: (response) => {
        let thumbnailList: string[] = [];
        if (response) {
          response.forEach((fileRs) => {
            if (fileRs.status === "fulfilled" && fileRs.value.data) {
              thumbnailList = [...thumbnailList, fileRs.value.data.fullPath];
            }
          });
          thumbnailList?.length && onChange?.(thumbnailList);
        }
      },
    });
  };
  return (
    <div className="galleries">
      <FormLabel component="div" className="mb-2 inline-block">
        {label}
        {required ? <span className="text-red-600 ml-1">*</span> : null}
      </FormLabel>
      {subTitle ? <Typography className="text-xs mb-4">{subTitle}</Typography> : null}
      {description ? <div className="description mb-2">{description}</div> : null}
      <div className="gallery-list">
        <Uploader
          accept={{ images: [".jpg", ".jpeg", ".png"] }}
          onChange={handleUploadImage}
          multiple={true}
          maxCount={5}
        />
      </div>
      {helperText ? <FormHelperText error={error}>{helperText}</FormHelperText> : null}
    </div>
  );
};
export default GalleriesUploader;
