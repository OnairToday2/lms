import { EyeIcon, ImageIcon, TrashIcon1 } from "@/shared/assets/icons";
import { cn } from "@/utils";
import { IconButton, Typography } from "@mui/material";
import { isArray } from "lodash";
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  onChange?: (files: File[] | File) => void;
  disabled?: boolean;
  multiple?: boolean;
  maxCount?: number;
  hideButtonWhenSingle?: boolean;
  buttonUpload?: React.ReactNode;
}
const Uploader: React.FC<UploaderProps> = ({
  className,
  multiple = false,
  variant = "square",
  disabled,
  onChange,
  maxCount = -1, // Unlimited
  accept = ALL_FILE_TYPE,
  hideButtonWhenSingle = false,
  buttonUpload,
}) => {
  const mounted = useRef(false);
  const fieldId = useId();
  const [fileList, setFileList] = useState<File[] | File>();

  const onInputFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newFileList = event.target.files;

      if (!newFileList || !newFileList.length) return;

      setFileList((prevFiles) => {
        if (!multiple) {
          const oneFile = newFileList[0];
          oneFile && onChange?.(oneFile);
          return oneFile;
        }

        if (maxCount < 0) {
          onChange?.([...newFileList]);
          return !!prevFiles && Array.isArray(prevFiles) ? [...prevFiles, ...newFileList] : [...newFileList];
        }

        const currentFileCount = prevFiles && Array.isArray(prevFiles) ? prevFiles.length : 0;
        const remaintCount = maxCount - currentFileCount;
        const newFileListByRemainCount = remaintCount > 0 ? [...newFileList].splice(0, remaintCount) : [];

        onChange?.(newFileListByRemainCount);
        return !!prevFiles && Array.isArray(prevFiles)
          ? [...prevFiles, ...newFileListByRemainCount]
          : [...newFileListByRemainCount];
      });

      setTimeout(() => {
        event.target.value = ""; // Make the smame file can be select at the second times.
      }, 0);
    },
    [maxCount],
  );

  const onRemoveFileItem = useCallback((index: number) => {
    setFileList((prevFile) => {
      if (prevFile && !isArray(prevFile)) {
        return undefined;
      }
      if (prevFile && isArray(prevFile)) {
        const updateFileList = [...prevFile];
        updateFileList.splice(index, 1);
        return updateFileList;
      }
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

  useEffect(() => {
    if (!mounted.current) return;
    mounted.current = true;
    setFileList((prevFile) => {
      if (Array.isArray(prevFile)) {
        const newFiles = [...prevFile].splice(0, maxCount);
        return newFiles;
      }
      return prevFile;
    });
    return () => {
      mounted.current = false;
    };
  }, [maxCount]);
  return (
    <div className={cn("thumbnail-uploader-container", className)}>
      <div className="flex items-center flex-wrap gap-2">
        {Array.isArray(fileList) ? (
          fileList?.map((file, _index) => (
            <FileItem file={file} index={_index} key={_index} onRemove={onRemoveFileItem} />
          ))
        ) : (
          <>{fileList ? <FileItem file={fileList} index={0} onRemove={onRemoveFileItem} /> : null}</>
        )}

        {multiple || (!multiple && !hideButtonWhenSingle) ? (
          <div className={cn("uploader-box")}>
            <label htmlFor={`image-upload-${fieldId}`} style={{ cursor: "pointer" }}>
              {buttonUpload ?? (
                <div
                  className={cn(
                    "button-uploader flex items-center justify-center",
                    "bg-gray-50 rounded-lg border border-dashed border-gray-300",
                    {
                      "w-32 h-32": variant === "square",
                    },
                  )}
                >
                  <div className="text-center">
                    <ImageIcon className="mb-2" />
                    <Typography className="text-xs">Chọn ảnh</Typography>
                  </div>
                </div>
              )}
              <input
                type="file"
                disabled={disabled}
                id={`image-upload-${fieldId}`}
                onChange={onInputFileChange}
                multiple={multiple}
                style={{ display: "none", textIndent: "9999px", opacity: 0 }}
                accept={acceptFileString}
              />
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
    <div
      className={cn("file-item", "relative flex items-center rounded-lg overflow-hidden justify-center", "group/item")}
    >
      <div className="file-item__thumbnail aspect-square w-32 bg-gray-100">
        <img src={url} className="w-full h-full object-contain" />
      </div>
      <div
        className={cn(
          "file-item__content px-2 absolute left-0 top-0 w-full h-full",
          "flex items-center gap-1 justify-center bg-gray-900/30",
          "invisible group-hover/item:visible",
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
