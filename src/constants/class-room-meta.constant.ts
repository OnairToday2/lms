export const CLASS_ROOM_META_KEY = {
  faqs: "_faqs",
  why: "_why",
  forWhom: "_forWhom",
  galleries: "_galleries",
} as const;

export type ClassRoomMetaKey = keyof typeof CLASS_ROOM_META_KEY;

export type ClassRoomMetaValue<K extends ClassRoomMetaKey = ClassRoomMetaKey> = K extends "faqs"
  ? { answer: string; question: string }[]
  : K extends "why"
  ? string[]
  : K extends "forWhom"
  ? string[]
  : K extends "galleries"
  ? string[]
  : any;
