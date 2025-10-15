"use client";
import { Tabs, Tab, Stack, Chip } from "@mui/material";
import { ClassRoomRuntimeStatus, COURSE_RUNTIME_STATUS_LABEL } from "../types/types";

interface ClassRoomStatusTabsProps {
  value: ClassRoomRuntimeStatus;
  counts: any;
  onChange: (status: ClassRoomRuntimeStatus) => void;
}

const STATUS_ORDER: ClassRoomRuntimeStatus[] = [
  ClassRoomRuntimeStatus.All,
  ClassRoomRuntimeStatus.Ongoing,
  ClassRoomRuntimeStatus.Today,
  ClassRoomRuntimeStatus.Upcoming,
  ClassRoomRuntimeStatus.Past,
  ClassRoomRuntimeStatus.Draft,
];

export default function ClassRoomStatusTabs({
  value,
  counts,
  onChange,
}: ClassRoomStatusTabsProps) {
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
          return (
            <Tab
              key={status}
              value={status}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{COURSE_RUNTIME_STATUS_LABEL[status]}</span>
                  <Chip
                    size="small"
                    color="primary"
                    label={counts?.[status] ?? 0}
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
