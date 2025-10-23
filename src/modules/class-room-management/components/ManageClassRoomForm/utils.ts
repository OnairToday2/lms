import { FieldErrors } from "react-hook-form";
import { ClassRoom } from "../classroom-form.schema";

type ClassRoomTabTypes = "idle" | "invalid" | "valid";
import { TAB_KEYS_CLASS_ROOM } from "./ClassRoomFormContainer";

/**
 * @param tabKey Name of classRoom tabs
 * @returns The key fields by tab.
 */
export const getKeyFieldByTab = (tabKey: keyof typeof TAB_KEYS_CLASS_ROOM) => {
  let keyListByTab: (keyof ClassRoom)[] = [];

  switch (tabKey) {
    case "clsTab-information": {
      keyListByTab = [
        "title",
        "thumbnailUrl",
        "hashTags",
        "slug",
        "description",
        "communityInfo",
        "classRoomField",
        "roomType",
      ];
      break;
    }
    case "clsTab-resource": {
      keyListByTab = ["docs", "faqs", "forWhom", "whies"];
      break;
    }

    case "clsTab-session": {
      keyListByTab = ["classRoomSessions"];
      break;
    }
    case "clsTab-setting": {
      keyListByTab = [];
      break;
    }
  }
  return keyListByTab;
};

export const getStatusTabClassRoom = (
  error: FieldErrors<ClassRoom>,
  tabKey: keyof typeof TAB_KEYS_CLASS_ROOM,
): ClassRoomTabTypes => {
  let tabStatus: ClassRoomTabTypes = "idle";

  const keyListByTab = getKeyFieldByTab(tabKey);

  const isValid = keyListByTab.every((key) => !error[key]);

  return isValid ? "valid" : "invalid";
};
