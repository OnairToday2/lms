"use client";
import { memo } from "react";
import { Typography } from "@mui/material";

interface TabAssignmentSettingsProps {}

const TabAssignmentSettings: React.FC<TabAssignmentSettingsProps> = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl p-6">
        <Typography className="text-gray-500">Thiết lập sẽ được thêm sau</Typography>
      </div>
    </div>
  );
};

export default memo(TabAssignmentSettings);

