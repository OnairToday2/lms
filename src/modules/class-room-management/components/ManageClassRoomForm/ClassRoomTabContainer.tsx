"use client";
import React, { useCallback, useMemo, useState, useImperativeHandle } from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import TabList, { TabListProps } from "@mui/lab/TabList";
import { Button, styled } from "@mui/material";
import { useTheme } from "@mui/material";
import { tabClasses } from "@mui/material";
import { cn } from "@/utils";
import { CheckCircleIcon } from "@/shared/assets/icons";
import { TAB_KEYS_CLASS_ROOM, TAB_NODES_CLASS_ROOM } from "./ClassRoomFormContainer";
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
type TabStateType = Record<TabKeyType, { status: ClassRoomTabStatus }>;
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
    const [isGotoNextTab, startGotoNextTab] = useTransition();
    const [currentTab, setCurrentTab] = useState<TabKeyType>(() => items?.[0]?.tabKey || "clsTab-information");
    const [tabsState, setTabsState] = useState(
      () => Object.fromEntries(items.map((tab) => [tab.tabKey, { status: "idle" }])) as TabStateType,
    );

    /**
     * Trigger validate all field in current tab before process next action
     */
    const validateCurrentTabBeforeProceed = useCallback(async (tab: TabKeyType, callback?: () => void) => {
      const keyList = getKeyFieldByTab(tab);

      await Promise.all(keyList.map((key) => trigger(key)));

      const status = getStatusTabClassRoom(errors, tab);

      setTabsState((prevState) => {
        return {
          ...prevState,
          [tab]: {
            status: status,
          },
        } as typeof prevState;
      });

      if (status === "invalid") return;

      callback?.();
    }, []);

    const handleChangeTab = useCallback(
      (_: React.SyntheticEvent, newTab: TabKeyType) =>
        setCurrentTab((oldTab) => {
          const nextTab = TAB_NODES_CLASS_ROOM.get(oldTab)?.next;
          const prevTab = TAB_NODES_CLASS_ROOM.get(oldTab)?.prev;
          return nextTab === newTab || prevTab === newTab ? newTab : oldTab;
        }),
      [currentTab],
    );
    /**
     * Next and back action each tab
     */
    const goNextOrBackStep = useCallback(
      (action: "next" | "back") => () =>
        validateCurrentTabBeforeProceed(currentTab, () => {
          startGotoNextTab(async () => {
            setCurrentTab((oldTab) => {
              const newTab =
                action === "next" ? TAB_NODES_CLASS_ROOM.get(oldTab)?.next : TAB_NODES_CLASS_ROOM.get(oldTab)?.prev;
              return newTab ? newTab : oldTab;
            });
            const scrollContainer = document.querySelector(".main-layout__content");
            scrollContainer?.scrollTo({ top: 0 });
          });
        }),
      [],
    );

    useImperativeHandle(ref, () => ({
      checkStatusAllTabItems: () => {
        setTabsState((prevTabState) => {
          let newTabStateUpdate = { ...prevTabState };
          items.forEach((tabItem) => {
            newTabStateUpdate = {
              ...newTabStateUpdate,
              [tabItem.tabKey]: { status: getStatusTabClassRoom(errors, tabItem.tabKey) },
            };
          });
          return newTabStateUpdate;
        });
      },
    }));

    return (
      <div className={cn("class-room-tabs", className)}>
        <TabContext value={currentTab}>
          <div className="bg-white rounded-xl flex items-center justify-between mb-6 px-6 py-4">
            <ClassRoomTabList onChange={handleChangeTab}>
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
