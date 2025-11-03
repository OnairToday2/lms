import { FieldErrors } from "react-hook-form";
import { ClassRoom, ClassRoomSession } from "../classroom-form.schema";
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
      keyListByTab = ["classRoomSessions"];
      break;
    }
  }
  return keyListByTab;
};

export const getStatusTabClassRoom = (
  errors: FieldErrors<ClassRoom>,
  tabKey: keyof typeof TAB_KEYS_CLASS_ROOM,
): "invalid" | "valid" => {
  const keyListByTab = getKeyFieldByTab(tabKey);

  const isValid = keyListByTab.every((key) => {
    if (key === "classRoomSessions") {
      const sessionsError = errors["classRoomSessions"] as FieldErrors<ClassRoomSession>[] | undefined;

      if (!sessionsError) return true;

      return sessionsError.every((session) => {
        if (!session) return true;
        /**
         * remove Qrcode
         */
        const { qrCode, ...restKeys } = session;

        if (tabKey === "clsTab-setting" && qrCode) {
          return false;
        }
        if (tabKey === "clsTab-session" && Object.keys(restKeys).length) {
          return false;
        }

        return true;
      });
    } else {
      return !errors[key];
    }
  });

  return isValid ? "valid" : "invalid";
};
