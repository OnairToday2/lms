import { StoreApi } from "zustand";
import { ClassRoomStore } from "./class-room-store";

export type ClassRoomActions = {
  reset: () => void;
};

const attachActions =
  (initState: any) =>
  (
    set: StoreApi<ClassRoomStore>["setState"],
    get: StoreApi<ClassRoomStore>["getState"],
  ): ClassRoomActions => ({
    reset: () => set(initState),
  });
export default attachActions;
