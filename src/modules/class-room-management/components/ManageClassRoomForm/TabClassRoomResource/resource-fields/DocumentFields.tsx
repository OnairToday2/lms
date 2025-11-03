"use client";
import { useUploadAsync } from "@/modules/class-room-management/hooks/useUpload";
import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { ClassRoom } from "../../../classroom-form.schema";
import {
  CloseIcon,
  CloudUploadIcon,
  FileAdioIcon,
  FileImageIcon,
  FileVideoIcon,
  FileWordIcon,
  TrashIcon1,
} from "@/shared/assets/icons";
import { Box, IconButton, Typography } from "@mui/material";
import Uploader from "@/shared/ui/Uploader";
import FileUnknownIcon from "@/shared/assets/icons/FileUnknownIcon";
import { getTypeOfFile } from "@/constants/file.constant";

interface DocumentFieldsProps {
  className?: string;
}
const DocumentFields: React.FC<DocumentFieldsProps> = ({ className }) => {
  const { fileList, onUploadMultipleAsync } = useUploadAsync();
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

  console.log({ fileList });

  const handleUploadFile = async (file: File | File[]) => {
    const filesUpload = Array.isArray(file) ? file : [file];

    /**
     * Should handle file size before upload.
     */
    await onUploadMultipleAsync(filesUpload, {
      onSuccess: (data, file) => {
        const fileExt = file.name.split(".").pop()?.toLowerCase();
        const fileType = fileExt ? getTypeOfFile(fileExt) : "unknown";
        if (data && fileExt) {
          append({
            fileExtension: fileExt,
            size: file.size,
            type: fileType,
            url: data.fullPath,
          });
        }
      },
    });
  };
  return (
    <div className={className}>
      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 3 }}>
        * Hỗ trợ tài liệu có dung lượng tối đa 5MB.
      </Typography>
      {fileList.length ? (
        <div className="flex items-center flex-wrap mb-4 -mx-2">
          {fileList.map((item, _index) => (
            <div key={_index} className="w-32 px-1 mb-2">
              <div className="py-4 px-2 bg-gray-100 relative flex flex-col rounded-lg w-full">
                <div className="file-icon mx-auto mb-4">
                  {item.fileType === "images" ? (
                    <FileImageIcon className="w-10 h-10" />
                  ) : item.fileType === "audios" ? (
                    <FileAdioIcon className="w-10 h-10" />
                  ) : item.fileType === "docs" ? (
                    <FileWordIcon className="w-10 h-10" />
                  ) : item.fileType === "videos" ? (
                    <FileVideoIcon className="w-10 h-10" />
                  ) : (
                    <FileUnknownIcon className="w-10 h-10" />
                  )}
                </div>
                <div className="file-name line-clamp-2 text-xs">{item.data?.path}</div>
                {item.isLoading && (
                  <div className="file-loading absolute left-0 top-0 w-full h-full flex items-center justify-center bg-gray-950/60 z-10">
                    <span className="text-xs text-white">Đang tải...</span>
                  </div>
                )}
                <IconButton className="w-6 h-6 absolute top-1 right-1">
                  <CloseIcon className="w-4 h-4" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <Uploader
        onChange={handleUploadFile}
        hidePreviewThumbnail
        multiple
        buttonUpload={
          <Box
            sx={(theme) => ({
              backgroundColor: theme.palette.primary["main"],
              display: "inline-flex",
              gap: "0.5rem",
              alignItems: "center",
              color: "white",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.5rem",
            })}
          >
            <CloudUploadIcon className="w-5 h-5" /> <Typography sx={{ fontSize: "0.875rem" }}>Tải lên</Typography>
          </Box>
        }
      />

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
