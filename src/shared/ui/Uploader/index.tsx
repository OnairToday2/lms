import { EyeIcon, ImageIcon, TrashIcon1 } from "@/shared/assets/icons";
import { cn } from "@/utils";
import { IconButton, Typography } from "@mui/material";
import { ChangeEvent, memo, useCallback, useMemo, useState } from "react";
import { useId } from "react";

const ALL_FILE_TYPE = {
  images: [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".bmp", ".tif", ".tiff"],
  audios: [".mp3", ".wav", ".ogg", ".m4a", ".flac"],
  docs: [
    ".pdf",
    ".doc",
    ".docx",
    ".xml",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
    ".md",
    ".csv",
    ".json",
    ".xml",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  videos: [".mp4", ".webm", ".avi", ".mov", ".mkv"],
} as const;
type FileTypesAccept = typeof ALL_FILE_TYPE;
type AcceptKeyOfFileTypes = keyof typeof ALL_FILE_TYPE;

export interface UploaderProps {
  className?: string;
  variant?: "square" | "16/9";
  accept?: Partial<Record<AcceptKeyOfFileTypes, Partial<FileTypesAccept[AcceptKeyOfFileTypes]>>>;
  onChange?: (files?: File[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  maxCount?: number;
}
const Uploader: React.FC<UploaderProps> = ({
  className,
  multiple = false,
  variant = "square",
  disabled,
  onChange,
  maxCount = -1,
  accept = ALL_FILE_TYPE,
}) => {
  const fieldId = useId();
  const [fileList, setFileList] = useState<File[]>([]);

  const onInputFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newFileList = event.target.files;
      if (!newFileList || !newFileList.length) return;

      const allFileList = [...fileList, ...newFileList];
      if (maxCount > 0) {
      }
      //  const newFileLimitByCount = newFileList.slice(fileList.length, maxCount)

      setFileList((prev) => [...prev, ...newFileList]);
      onChange?.([...newFileList]);
      setTimeout(() => {
        event.target.value = ""; // Make the smame file can be select at the second times.
      }, 0);
    },
    [maxCount],
  );

  const onRemoveFileItem = useCallback((index: number) => {
    setFileList((prev) => {
      const updateFileList = [...(prev || [])];
      updateFileList.splice(index, 1);
      return updateFileList;
    });
  }, []);

  const acceptFileString = useMemo(() => {
    return Object.keys(accept).reduce<string>((acc, key) => {
      const items = accept[key as keyof typeof accept];
      if (items?.length) {
        acc = acc.concat(items.join(","), ",");
      }
      return acc;
    }, "");
  }, [accept]);
  return (
    <div className={cn("thumbnail-uploader-container", className)}>
      <div className="flex items-center gap-2">
        {fileList?.length ? (
          <div className="flex gap-2">
            {fileList?.map((file, _index) => (
              <FileItem file={file} index={_index} key={_index} onRemove={onRemoveFileItem} />
            ))}
          </div>
        ) : null}
        {multiple || (!multiple && !fileList.length) ? (
          <div
            className={cn("uploader-box", "bg-gray-50 rounded-lg border border-dashed border-gray-300", {
              "w-32 h-32": variant === "square",
            })}
          >
            <label
              htmlFor={`image-upload-${fieldId}`}
              style={{ cursor: "pointer", width: "100%", height: "100%" }}
              className="flex items-center justify-center"
            >
              <div className="icon-image-empty text-center">
                <ImageIcon className="mb-2" />
                <Typography className="text-xs">Chọn ảnh</Typography>
                <input
                  type="file"
                  id={`image-upload-${fieldId}`}
                  onChange={onInputFileChange}
                  multiple={multiple}
                  style={{ display: "none", textIndent: "9999px", opacity: 0 }}
                  accept={acceptFileString}
                />
              </div>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default memo(Uploader);

interface FileItemProps {
  file: File;
  index: number;
  onRemove?: (index: number) => void;
}
const FileItem: React.FC<FileItemProps> = ({ file, index, onRemove }) => {
  const url = window.URL.createObjectURL(file);

  const removeItem = () => {
    if (onRemove) {
      window.URL.revokeObjectURL(url);
      onRemove(index);
    }
  };
  return (
    <div className="file-item aspect-square w-32 bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center">
      <div className="file-item__thumbnail">
        <img src={url} />
      </div>
      <div
        className={cn(
          "file-item__content px-2 absolute left-0 top-0 w-full h-full",
          "flex items-center gap-1 justify-center bg-gray-900/30",
        )}
      >
        <IconButton className="w-6 h-6 bg-transparent hover:bg-gray-900/60">
          <EyeIcon className="w-4 h-4 stroke-white" />
        </IconButton>
        <IconButton onClick={removeItem} className="w-6 h-6 bg-transparent hover:bg-gray-900/60">
          <TrashIcon1 className="w-4 h-4 stroke-white" />
        </IconButton>
      </div>
    </div>
  );
};
