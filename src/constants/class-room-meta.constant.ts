export const CLASS_ROOM_META_KEY = {
  faqs: "_faqs",
  why: "_why",
  forWhom: "_forWhom",
} as const;

export type ClassRoomMetaKey = keyof typeof CLASS_ROOM_META_KEY;
