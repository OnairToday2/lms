"use client";
import {
  createAgendasWithSession,
  CreateAgendasWithSessionPayload,
  createClassRoom,
  CreateClassRoomSessionsPayload,
  createClassSession,
  createPivotClassRoomAndEmployee,
  CreatePivotClassRoomAndEmployeePayload,
  createPivotClassRoomAndField,
  CreatePivotClassRoomAndFieldPayload,
  createPivotClassRoomAndHashTag,
  CreatePivotClassRoomAndHashTagPayload,
  createPivotClassSessionAndTeacher,
  CreatePivotClassSessionAndTeacherPayload,
} from "@/repository/classRoom";
import { ClassRoom } from "../components/classroom-form.schema";
import { EmployeeStudentWithProfileItem, EmployeeTeacherTypeItem } from "@/model/employee.model";
import { useUserOrganization } from "@/modules/organization/store/UserOrganizationProvider";
import { useTMutation } from "@/lib";

const useCRUDClassRoom = () => {
  const userInfo = useUserOrganization((state) => state.data);

  const { mutate: doCreateClassRoom, isPending } = useTMutation({
    mutationKey: ["CREATE_CLASS_ROOM"],
    mutationFn: async (payload: {
      formData: ClassRoom;
      teachers: {
        [sessionIndex: number]: EmployeeTeacherTypeItem[];
      };
      employees: EmployeeStudentWithProfileItem[];
    }) => {
      const { formData, teachers, employees } = payload;
      const {
        classRoomField,
        hashTags,
        classRoomSessions,
        communityInfo,
        description,
        thumbnailUrl,
        roomType,
        slug,
        status,
        title,
      } = formData;
      const { startDate, endDate } = getStartDateAndEndDateFromClassSession(classRoomSessions, roomType);
      /**
       * Create ClassRoom first
       */
      const { data: classRoomData, error } = await createClassRoom({
        comunity_info: communityInfo,
        description: description,
        room_type: roomType,
        slug: slug,
        status: status,
        thumbnail_url: thumbnailUrl,
        title: title,
        employee_id: userInfo.id,
        start_at: startDate,
        end_at: endDate,
        organization_id: userInfo.organization.id,
        resource_id: null,
      });
      if (error) {
        throw new Error(error.message);
      }
      const createPivoteClassRoomAndFieldPayload = classRoomField.map<CreatePivotClassRoomAndFieldPayload>(
        (fieldId) => ({
          class_field_id: fieldId,
          class_room_id: classRoomData.id,
        }),
      );
      const createPivoteClassRoomAndHashTagPayload = hashTags.map<CreatePivotClassRoomAndHashTagPayload>(
        (hashTagId) => ({
          hash_tag_id: hashTagId,
          class_room_id: classRoomData.id,
        }),
      );
      const classRoomAndEmployeePlayload = employees.map<CreatePivotClassRoomAndEmployeePayload>((tc) => ({
        class_room_id: classRoomData.id,
        employee_id: tc.id,
      }));
      const { data: employeeWithClassRoom } = await createPivotClassRoomAndEmployee(classRoomAndEmployeePlayload);
      await createPivotClassRoomAndField(createPivoteClassRoomAndFieldPayload);
      await createPivotClassRoomAndHashTag(createPivoteClassRoomAndHashTagPayload);
      /**
       * Create Sessions of classRooms
       */
      const classRoomSessionPayload = getClassRoomSessionPayload(classRoomSessions, roomType, title, description);
      const { data: sessionsData } = await createClassSession({
        classRoomId: classRoomData.id,
        sessions: classRoomSessionPayload,
      });
      if (!sessionsData) {
        throw new Error("Create Session failed");
      }
      const createAgendasWithPayload = classRoomSessions?.reduce<CreateAgendasWithSessionPayload[]>(
        (acc, session, _sIndex) => {
          const sessionId = sessionsData[_sIndex]?.id;
          if (sessionId) {
            const agendas = session.agendas.map<CreateAgendasWithSessionPayload>((agenda) => ({
              class_session_id: sessionId,
              title: agenda.title,
              description: agenda.description,
              start_at: agenda.startDate,
              end_at: agenda.endDate,
              thumbnail_url: null,
            }));
            acc = [...acc, ...agendas];
          }
          return acc;
        },
        [],
      );
      await createAgendasWithSession(createAgendasWithPayload);
      const createPivotClassSessionAndTeacherPayload = Object.entries(teachers).reduce<
        CreatePivotClassSessionAndTeacherPayload[]
      >((acc, [_, teachers], _index) => {
        const sessionId = sessionsData[_index]?.id;
        if (sessionId) {
          const teacherListWithSessionId = teachers.map<CreatePivotClassSessionAndTeacherPayload>((tc) => ({
            class_session_id: sessionId,
            teacher_id: tc.id,
          }));
          acc = [...acc, ...teacherListWithSessionId];
        }
        return acc;
      }, []);
      const { data: sessionTeacher, error: sessionTeacherError } = await createPivotClassSessionAndTeacher(
        createPivotClassSessionAndTeacherPayload,
      );
      console.log("createdSucccess", classRoomData, sessionsData, employeeWithClassRoom, sessionTeacher);
      return classRoomData;
    },
  });

  /**
   *
   * @param roomSessions
   * @param roomType
   * @returns duration Date for classRoom.
   */
  const getStartDateAndEndDateFromClassSession = (
    roomSessions: ClassRoom["classRoomSessions"],
    roomType: ClassRoom["roomType"],
  ) => {
    let startDate, endDate;

    if (roomType === "single") {
      startDate = roomSessions[0]?.startDate;
      endDate = roomSessions[0]?.endDate;
    }

    if (roomType === "multiple") {
      const firstSession = [...roomSessions].shift();
      const lastSession = [...roomSessions].pop();

      startDate = firstSession?.startDate;
      endDate = lastSession?.endDate;
    }

    if (!startDate || !endDate) {
      throw new Error("Room sessions is emplty date");
    }

    return { startDate, endDate };
  };

  const getClassRoomSessionPayload = (
    classRoomSessions: ClassRoom["classRoomSessions"],
    roomType: ClassRoom["roomType"],
    classRoomTitle: string,
    classRoomDescription: string,
  ): CreateClassRoomSessionsPayload["sessions"] => {
    return classRoomSessions.reduce<CreateClassRoomSessionsPayload["sessions"]>((acc, session) => {
      return [
        ...acc,
        {
          title: roomType === "single" ? classRoomTitle : session.title,
          description: roomType === "single" ? classRoomDescription : session.description,
          channel_info: session.channelInfo,
          channel_provider: session.channelProvider,
          end_at: session.endDate,
          start_at: session.startDate,
          is_online: session.isOnline,
          limit_person: session.isUnlimited ? -1 : session.limitPerson,
          resource_ids: null,
        },
      ];
    }, []);
  };

  return {
    onCreate: doCreateClassRoom,
    isLoading: isPending,
  };
};
export { useCRUDClassRoom };
