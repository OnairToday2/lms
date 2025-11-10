import React, { useState } from "react";
import { FilePdf02Icon, FileWord02Icon, VideoIcon } from "@/shared/assets/icons";
import { Typography } from "@mui/material";
import { LessionType } from "@/model/lession.model";
import { cn } from "@/utils";
export interface LessionTypeSelectorProps {
  onSelect: (type: LessionType) => void;
}
const LessionTypeSelector: React.FC<LessionTypeSelectorProps> = ({ onSelect }) => {
  const [lessionType, setLessionType] = useState<LessionType>();

  const handleSelect = (type: LessionType) => () => {
    setLessionType(type);
    onSelect(type);
  };
  return (
    <div className="grid grid-cols-3 gap-6">
      <div
        className={cn("border flex items-center justify-center rounded-xl p-6 cursor-pointer", {
          "border-blue-600": lessionType === "video",
          "border-gray-300": lessionType !== "video",
        })}
        onClick={handleSelect("video")}
      >
        <div>
          <VideoIcon className="w-[72px] h-[72px] mb-3" />
          <Typography sx={{ textAlign: "center", fontWeight: 600 }} variant="body2">
            Video
          </Typography>
        </div>
      </div>
      <div
        className={cn("border flex items-center justify-center rounded-xl p-6 cursor-pointer", {
          "border-blue-600": lessionType === "file",
          "border-gray-300": lessionType !== "file",
        })}
        onClick={handleSelect("file")}
      >
        <div>
          <FilePdf02Icon className="w-[72px] h-[72px] mb-3" />
          <Typography sx={{ textAlign: "center", fontWeight: 600 }} variant="body2">
            File Pdf
          </Typography>
        </div>
      </div>
      <div
        className={cn("border flex items-center justify-center border-gray-300 rounded-xl p-6 cursor-pointer", {
          "border-blue-600": lessionType === "assessment",
          "border-gray-300": lessionType !== "assessment",
        })}
        onClick={handleSelect("assessment")}
      >
        <div>
          <FileWord02Icon className="w-[72px] h-[72px] mb-3" />
          <Typography sx={{ textAlign: "center", fontWeight: 600 }} variant="body2">
            Bài kiểm tra
          </Typography>
        </div>
      </div>
    </div>
  );
};
export default LessionTypeSelector;
