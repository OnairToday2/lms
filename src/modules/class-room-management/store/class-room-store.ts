import attachActions from "./class-room-actions";
import { createStore } from "zustand/vanilla";
import { ClassRoomActions } from "./class-room-actions";
import { EmployeeStudentWithProfileItem, EmployeeTeacherTypeItem } from "@/model/employee.model";

type ClassRoomState = {
  formData?: {};
  teacherList: {
    [sessionIndex: number | string]: EmployeeTeacherTypeItem[];
  };
  studentList: EmployeeStudentWithProfileItem[];
};

type ClassRoomStore = {
  state: ClassRoomState;
  actions: ClassRoomActions;
};

const createClassRoomStore = (initState: ClassRoomState) => {
  return createStore<ClassRoomStore>()((set, get, store) => ({
    state: { ...initState },
    actions: {
      ...attachActions(initState)(set, get, store),
    },
  }));
};
export { createClassRoomStore };
export type { ClassRoomStore, ClassRoomActions, ClassRoomState };
