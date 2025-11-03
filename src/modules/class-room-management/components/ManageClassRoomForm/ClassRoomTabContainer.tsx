"use client";
import * as React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import TabList, { TabListProps } from "@mui/lab/TabList";
import { Button, styled } from "@mui/material";
import { useTheme } from "@mui/material";
import { tabClasses } from "@mui/material";
import { cn } from "@/utils";
import { CheckCircleIcon } from "@/shared/assets/icons";
import { TAB_KEYS_CLASS_ROOM } from "./ClassRoomFormContainer";
import { useTransition } from "react";
import { getKeyFieldByTab } from "./utils";
import { FieldErrors, UseFormTrigger } from "react-hook-form";
import { ClassRoom } from "../classroom-form.schema";
import { getStatusTabClassRoom } from "./utils";

type ClassRoomTabStatus = "idle" | "invalid" | "valid";
type TabKeyType = keyof typeof TAB_KEYS_CLASS_ROOM;
type ClassRoomTabItem = {
  tabName: React.ReactNode;
  tabKey: TabKeyType;
  content?: React.ReactNode;
  icon?: React.ReactNode;
};
export interface ClassRoomTabContainerRef {
  checkStatusAllTabItems: () => void;
}
export interface ClassRoomTabContainerProps {
  items: ClassRoomTabItem[];
  previewUI?: React.ReactNode;
  actions: React.ReactNode;
  className?: string;
  trigger: UseFormTrigger<ClassRoom>;
  errors: FieldErrors<ClassRoom>;
}
const ClassRoomTabContainer = React.forwardRef<ClassRoomTabContainerRef, ClassRoomTabContainerProps>(
  ({ items, className, previewUI, actions, trigger, errors }, ref) => {
    const [tabsState, setTabsState] = React.useState(
      () =>
        Object.fromEntries(items.map((tab) => [tab.tabKey, { status: "idle" }])) as Record<
          TabKeyType,
          { status: ClassRoomTabStatus }
        >,
    );
    const [currentTab, setCurrentTab] = React.useState<TabKeyType>(() => items?.[0]?.tabKey || "clsTab-information");
    const [isGotoNextTab, startGotoNextTab] = useTransition();
    const handleChange = React.useCallback((event: React.SyntheticEvent, newValue: TabKeyType) => {
      setCurrentTab(newValue);
    }, []);

    const triggerFieldByTab = async (takKey: keyof typeof TAB_KEYS_CLASS_ROOM) => {
      const keysTriggerByTab = getKeyFieldByTab(takKey);
      const triggersInformationKeys = keysTriggerByTab.map((key) => {
        return trigger(key);
      });
      return (await Promise.all(triggersInformationKeys)).every(Boolean);
    };

    const goNextOrBackStep = (action: "next" | "back") => () => {
      startGotoNextTab(async () => {
        await triggerFieldByTab(currentTab);
        setTabsState((prevTabState) => {
          return {
            ...prevTabState,
            [currentTab]: {
              status: getStatusTabClassRoom(errors, currentTab),
            },
          } as typeof prevTabState;
        });
        const status = getStatusTabClassRoom(errors, currentTab);

        if (status === "invalid") return;

        if (currentTab === "clsTab-information") {
          setCurrentTab(action === "next" ? "clsTab-session" : "clsTab-information");
        }
        if (currentTab === "clsTab-session") {
          setCurrentTab(action === "next" ? "clsTab-resource" : "clsTab-information");
        }
        if (currentTab === "clsTab-resource") {
          setCurrentTab(action === "next" ? "clsTab-setting" : "clsTab-session");
        }
        const scrollContainer = document.querySelector(".main-layout__content");
        scrollContainer?.scrollTo({ top: 0 });
      });
    };

    React.useImperativeHandle(ref, () => ({
      checkStatusAllTabItems: () => {
        setTabsState((prevTabState) => {
          let updateTabState = { ...prevTabState };
          items.forEach((tabItem) => {
            updateTabState = {
              ...updateTabState,
              [tabItem.tabKey]: getStatusTabClassRoom(errors, tabItem.tabKey),
            };
          });
          return updateTabState;
        });
      },
    }));

    return (
      <div className={cn("class-room-tabs", className)}>
        <TabContext value={currentTab}>
          <div className="bg-white rounded-xl flex items-center justify-between mb-6 px-6 py-4">
            <ClassRoomTabList onChange={handleChange}>
              {items.map(({ tabKey, tabName, icon }) => (
                <Tab
                  key={tabKey}
                  value={tabKey}
                  label={
                    <div className="flex items-center gap-1">
                      {tabsState[tabKey].status === "valid" ? <CheckCircleIcon /> : icon ? icon : null}
                      {tabName}
                    </div>
                  }
                  className={cn("px-0", {
                    "is-invalid": tabsState[tabKey].status === "invalid",
                    "is-valid": tabsState[tabKey].status === "valid",
                  })}
                />
              ))}
            </ClassRoomTabList>
            <div className="tab-actions">{actions}</div>
          </div>
          <div
            className={cn("grid gap-6", {
              "lg:grid-cols-2 grid-cols-1": currentTab !== "clsTab-setting",
              "grid-cols-1": currentTab === "clsTab-setting",
            })}
          >
            <div className="panels-wraper">
              {items.map((item) => (
                <TabPanel key={item.tabKey} value={item.tabKey} className="p-0">
                  {item?.content}
                </TabPanel>
              ))}
              <div className={cn({ hidden: currentTab === "clsTab-setting" })}>
                <div className={cn("py-6 flex justify-between")}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={goNextOrBackStep("back")}
                    disabled={isGotoNextTab}
                  >
                    Quay lại
                  </Button>
                  <Button variant="fill" onClick={goNextOrBackStep("next")} disabled={isGotoNextTab}>
                    Tiếp tục
                  </Button>
                </div>
              </div>
            </div>
            <div
              className={cn("preview-ui", {
                hidden: currentTab === "clsTab-setting",
              })}
            >
              {previewUI}
            </div>
          </div>
        </TabContext>
      </div>
    );
  },
);
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
