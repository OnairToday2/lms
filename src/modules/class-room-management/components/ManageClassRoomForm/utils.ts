import { FieldErrors } from "react-hook-form";
import { ClassRoom } from "../classroom-form.schema";

type ClassRoomTabTypes = "idle" | "invalid" | "valid";
import { CLASS_ROOM_TAB_KEYS } from "./ClassRoomContainer";
export const getClassRoomTabValidationStatus = (
  error: FieldErrors<ClassRoom>,
  tabKey: keyof typeof CLASS_ROOM_TAB_KEYS,
): ClassRoomTabTypes => {
  let tabStatus: ClassRoomTabTypes = "idle";
  if (tabKey === "clsTab-information") {
    const classRoomInformationCheckKeys: (keyof typeof error)[] = [
      "title",
      "description",
      "hashTags",
      "classRoomField",
      "slug",
    ];
    const isValidInformationFields = classRoomInformationCheckKeys.every((key) => !!error[key]);
    return isValidInformationFields ? "valid" : "invalid";
  }
  if (tabKey === "clsTab-session") {
    const isValidSessionFields = Boolean(!error?.["classRoomSessions"]);
    return isValidSessionFields ? "valid" : "invalid";
  }
  if (tabKey === "clsTab-resource") {
    const isValidResouceFields =
      Boolean(!error?.["faqs"]) && Boolean(!error?.["forWhom"]) && Boolean(!error?.["whies"]);

    return isValidResouceFields ? "valid" : "invalid";
  }

  if (tabKey === "clsTab-setting") {
    return "valid";
  }
  return tabStatus;
};
