import { FieldErrors } from "react-hook-form";
import { UpsertCourseFormData } from "../upsert-course.schema";
import { TAB_KEYS_CLASS_ROOM } from "./UpsertCourseFormContainer";

/**
 * @param tabKey Name of classRoom tabs
 * @returns The key fields by tab.
 */
export const getKeyFieldByTab = (tabKey: keyof typeof TAB_KEYS_CLASS_ROOM) => {
  let keyListByTab: (keyof UpsertCourseFormData)[] = [];

  switch (tabKey) {
    case "clsTab-information": {
      keyListByTab = ["title", "thumbnailUrl", "slug", "description", "categories", "roomType", "docs", "forWhom"];
      break;
    }

    case "clsTab-session": {
      keyListByTab = ["classRoomSessions"];
      break;
    }
    case "clsTab-setting": {
      break;
    }
  }
  return keyListByTab;
};

export const getStatusTabClassRoom = (
  errors: FieldErrors<UpsertCourseFormData>,
  tabKey: keyof typeof TAB_KEYS_CLASS_ROOM,
): "invalid" | "valid" => {
  const keyListByTab = getKeyFieldByTab(tabKey);

  const isValid = keyListByTab.every((key) => !errors[key]);

  return isValid ? "valid" : "invalid";
};
