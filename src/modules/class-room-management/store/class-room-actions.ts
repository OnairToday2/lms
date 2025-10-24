import { StoreApi } from "zustand";
import { ClassRoomStore } from "./class-room-store";
import { EmployeeStudentWithProfileItem, EmployeeTeacherTypeItem } from "@/model/employee.model";

export type ClassRoomActions = {
  reset: () => void;
  setSelectTeacher: (sessionIndex: number, teachers: EmployeeTeacherTypeItem[]) => void;
  getTeachers: (sessionIndex: number) => EmployeeTeacherTypeItem[] | undefined;
  removeTeacher: (id: string, sessionIndex: number) => void;
  setStudents: (students: EmployeeStudentWithProfileItem[]) => void;
};

const attachActions =
  (initState: ClassRoomStore["state"]) =>
  (
    set: StoreApi<ClassRoomStore>["setState"],
    get: StoreApi<ClassRoomStore>["getState"],
    store: StoreApi<ClassRoomStore>,
  ): ClassRoomActions => ({
    setSelectTeacher: (sessionIndex, teachers) =>
      set((prev) => ({
        ...prev,
        state: {
          ...prev.state,
          teacherList: {
            ...prev.state.teacherList,
            [sessionIndex]: [...(prev.state.teacherList[sessionIndex] || []), ...teachers],
          },
        },
      })),
    removeTeacher: (id, sessionIndex) => {
      const {
        state: { teacherList },
      } = get();

      set((prev) => {
        const currentTeacherList = teacherList[sessionIndex];
        const newListTeacher = currentTeacherList?.filter((tc) => tc.id !== id);
        return {
          ...prev,
          state: {
            ...prev.state,
            teacherList: {
              ...prev.state.teacherList,
              [sessionIndex]: newListTeacher ? [...newListTeacher] : [],
            },
          },
        };
      });
    },
    getTeachers: (sessionIndex: number) => {
      const {
        state: { teacherList },
      } = get();

      return teacherList[sessionIndex];
    },
    setStudents: (employees) => {
      set((prevState) => ({
        ...prevState,
        state: {
          ...prevState.state,
          studentList: employees,
        },
      }));
    },
    reset: () => {
      set(store.getInitialState());
    },
  });
export default attachActions;
