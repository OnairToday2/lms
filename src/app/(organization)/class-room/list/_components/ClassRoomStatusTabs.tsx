"use client";
import { Tabs, Tab, Stack, Chip } from "@mui/material";
import { ClassRoomRuntimeStatus } from "../types/types";
import { COURSE_RUNTIME_STATUS_LABEL, STATUS_ORDER } from "../utils/status";

interface ClassRoomStatusTabsProps {
  value: ClassRoomRuntimeStatus;
  counts?: {
    runtime_status: string;
    total: number;
  }[];
  onChange: (status: ClassRoomRuntimeStatus) => void;
}
const countFormatter = new Intl.NumberFormat("vi-VN");

export default function ClassRoomStatusTabs({
  value,
  counts,
  onChange,
}: ClassRoomStatusTabsProps) {

  const getCount = (status: string) => {
    const matched = counts?.find((c) =>
      c.runtime_status === status ||
      (c.runtime_status === null && status === "all")
    );
    return matched?.total ?? 0;
  };

  return (
    <Tabs
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
    >
      {
        STATUS_ORDER.map((status) => {
          const count = getCount(status);
          return (
            <Tab
              key={status}
              value={status}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{COURSE_RUNTIME_STATUS_LABEL[status]}</span>
                  <Chip
                    size="small"
                    color={count > 0 ? "primary" : "default"}
                    label={countFormatter.format(count)}
                  />
                </Stack>
              }
            />
          )
        })
      }
    </Tabs>
  );
}
