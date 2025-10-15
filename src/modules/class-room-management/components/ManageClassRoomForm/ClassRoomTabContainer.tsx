"use client";
import * as React from "react";
import Tab, { TabProps } from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import TabList, { TabListProps } from "@mui/lab/TabList";
import { styled, SxProps, Theme } from "@mui/material";
import { useTheme } from "@mui/material";
import { tabClasses } from "@mui/material";
import { cn } from "@/utils";

type ClassRoomTabStatus = "idle" | "invalid" | "valid";
type ClassRoomTabItem = {
  tabName: React.ReactNode;
  tabKey: string;
  content?: React.ReactNode;
  status?: ClassRoomTabStatus;
  icon?: React.ReactNode;
};
export interface ClassRoomTabContainerProps {
  items: ClassRoomTabItem[];
  previewUI?: React.ReactNode;
  actions: React.ReactNode;
  className?: string;
}
const ClassRoomTabContainer: React.FC<ClassRoomTabContainerProps> = ({ items, className, previewUI, actions }) => {
  const [currentTab, setCurrentTab] = React.useState(() => items?.[0]?.tabKey || "");

  const handleChange = React.useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <div className={cn("custom-tab", className)}>
      <TabContext value={currentTab}>
        <div className="bg-white rounded-xl flex items-center justify-between mb-6 px-6 py-4">
          <div className="tab-items">
            <ClassRoomTabList onChange={handleChange}>
              {items.map(({ tabKey, tabName, status = "idle", icon }) => (
                <Tab
                  key={tabKey}
                  value={tabKey}
                  label={
                    <div className="flex items-center gap-1">
                      {icon ? icon : null}
                      {tabName}
                    </div>
                  }
                  className={cn("px-0", {
                    "is-invalid": status === "invalid",
                    "is-valid": status === "valid",
                  })}
                />
              ))}
            </ClassRoomTabList>
          </div>
          <div>{actions}</div>
        </div>
        <div className="grid grid-cols-2 gap-6 items-start">
          <div className="panel">
            {items.map((item) => (
              <TabPanel key={item.tabKey} value={item.tabKey} className="p-0">
                {item?.content}
              </TabPanel>
            ))}
          </div>
          <div className="preview-ui">{previewUI}</div>
        </div>
      </TabContext>
    </div>
  );
};
export default ClassRoomTabContainer;

const ClassRoomTabList = styled((props: TabListProps) => <TabList {...props} />)(() => {
  const theme = useTheme();
  return {
    borderColor: theme.palette.grey[400],
    fontSize: theme.typography.fontSize,
    [`.MuiTabs-list`]: {
      zIndex: 10,
      gap: 24,
      position: "relative",
      [`& .${tabClasses.root}`]: {
        padding: "10px",
        marginBottom: 0,
        [`& .${tabClasses.selected}`]: {
          color: "white",
        },
        textTransform: "inherit",
        color: `${theme.palette.grey[900]} !important`,
        "&.is-invalid": {
          color: `${theme.palette.error["main"]} !important`,
        },
        "&.is-valid": {
          color: `${theme.palette.primary["main"]} !important`,
        },
        "&:not(.Mui-selected)": {
          opacity: 0.6,
        },
      },
    },
    ".MuiTabs-indicator": {
      backgroundColor: `${theme.palette.grey[900]} !important`,
    },
  };
});
