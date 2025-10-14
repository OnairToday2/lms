import type { ClassRoom } from "@/model/class-room.model";
import attachActions from "./class-room-actions";
import { createStore } from "zustand/vanilla";
import { ClassRoomActions } from "./class-room-actions";
import { Dayjs } from "dayjs";
import { ClassSessionChannelProvider } from "@/model/class-session.model";

import {
  ClassRoomInformation,
  ClassRoomSessionTeacher,
  ClassRoomSession,
} from "../validation";

type ClassRoomState = {
  formData?: {
    clsInformation: ClassRoomInformation;
    clsSession: ClassRoomSession[];
    clsTeacher: ClassRoomSessionTeacher[];
  };
};

type ClassRoomStore = ClassRoomState & ClassRoomActions;

const createClassRoomStore = (initState: ClassRoomState) => {
  return createStore<ClassRoomStore>()((set, get) => ({
    ...initState,
    ...attachActions(initState)(set, get),
  }));
};
export { createClassRoomStore };
export type { ClassRoomStore, ClassRoomActions, ClassRoomState };
