import attachActions from "./class-room-actions";
import { createStore } from "zustand/vanilla";
import { ClassRoomActions } from "./class-room-actions";
import { EmployeeType } from "@/model/employee.model";

export type TeacherSelectedItem = {
  id: string;
  fullName: string;
  email: string;
  employeeCode: string;
  avatar: string | null;
  empoyeeType: Exclude<EmployeeType, "admin" | "student">;
};
export type StudentSelectedItem = {
  id: string;
  fullName: string;
  email: string;
  employeeCode: string;
  avatar: string | null;
  empoyeeType: Exclude<EmployeeType, "admin" | "teacher">;
};

type ClassRoomState = {
  selectedTeachers: {
    [sessionIndex: number | string]: TeacherSelectedItem[];
  };
  selectedStudents: StudentSelectedItem[];
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
