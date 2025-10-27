"use client";
import { classRoomRepository, classRoomSessionRepository, classRoomMetaRepository } from "@/repository";
import type {
  CreatePivotClassRoomAndEmployeePayload,
  CreatePivotClassRoomAndFieldPayload,
  CreatePivotClassRoomAndHashTagPayload,
  CreateAgendasWithSessionPayload,
} from "@/repository/class-room";
import {
  CreateClassRoomSessionsPayload,
  CreatePivotClassRoomSessionAndTeacherPayload,
} from "@/repository/class-room-session";

import { ClassRoom } from "../components/classroom-form.schema";
import { useUserOrganization } from "@/modules/organization/store/UserOrganizationProvider";
import { useTMutation } from "@/lib";
import { ClassRoomStore } from "../store/class-room-store";
import { isUndefined } from "lodash";

const useCRUDClassRoom = () => {
  const userInfo = useUserOrganization((state) => state.data);

  const { mutate: doCreateClassRoom, isPending } = useTMutation({
    mutationKey: ["CREATE_CLASS_ROOM"],
    mutationFn: async (payload: {
      formData: ClassRoom;
      teachers: ClassRoomStore["state"]["selectedTeachers"];
      students: ClassRoomStore["state"]["selectedStudents"];
    }) => {
      const { formData, teachers, students } = payload;
      const {
        classRoomField,
        hashTags,
        classRoomSessions,
        communityInfo,
        galleries,
        description,
        thumbnailUrl,
        roomType,
        slug,
        status,
        title,
        faqs,
        forWhom,
        docs,
        whies,
      } = formData;

      console.log({ payload });
      const { startDate, endDate } = getStartDateAndEndDateFromClassSession(classRoomSessions, roomType);
      /**
       * Create ClassRoom first
       */
      const { data: classRoomData, error } = await classRoomRepository.upsertClassRoom({
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
        console.log("Create Classroom Failed", error);
        return;
      }

      if (faqs.length) {
        const { data: faqsData, error: faqsDataError } = await classRoomMetaRepository.createClassRoomMeta({
          class_room_id: classRoomData.id,
          key: "faqs",
          value: faqs.map((faq) => ({ answer: faq.answer, question: faq.question })),
        });
      }

      if (whies.length) {
        const { data: whyData, error: whyError } = await classRoomMetaRepository.createClassRoomMeta({
          class_room_id: classRoomData.id,
          key: "why",
          value: whies.map((item) => item.description),
        });
      }

      if (forWhom.length) {
        const { data: forWhomData, error: forWhomError } = await classRoomMetaRepository.createClassRoomMeta({
          class_room_id: classRoomData.id,
          key: "forWhom",
          value: forWhom.map((item) => item.description),
        });
      }
      if (galleries.length) {
        const { data: galleriesData, error: galleriesDataError } = await classRoomMetaRepository.createClassRoomMeta({
          class_room_id: classRoomData.id,
          key: "galleries",
          value: galleries,
        });
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
      const classRoomAndEmployeePlayload = students.map<CreatePivotClassRoomAndEmployeePayload>((tc) => ({
        class_room_id: classRoomData.id,
        employee_id: tc.id,
      }));
      const { data: employeeWithClassRoom } = await classRoomRepository.createPivotClassRoomAndEmployee(
        classRoomAndEmployeePlayload,
      );
      await classRoomRepository.createPivotClassRoomAndField(createPivoteClassRoomAndFieldPayload);
      await classRoomRepository.createPivotClassRoomAndHashTag(createPivoteClassRoomAndHashTagPayload);
      /**
       * Create Sessions of classRooms
       */
      const classRoomSessionPayload = getClassRoomSessionPayload(classRoomSessions, roomType, title, description);
      const { data: sessionsData, error: sessionDataError } = await classRoomSessionRepository.createClassSession({
        classRoomId: classRoomData.id,
        sessions: classRoomSessionPayload,
      });
      if (!sessionsData) {
        console.log("Create Session failed", sessionDataError);
        return;
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
      await classRoomSessionRepository.createAgendasWithSession(createAgendasWithPayload);
      const createPivotClassSessionAndTeacherPayload = Object.entries(teachers).reduce<
        CreatePivotClassRoomSessionAndTeacherPayload[]
      >((acc, [_, teachers], _index) => {
        const sessionId = sessionsData[_index]?.id;
        if (sessionId) {
          const teacherListWithSessionId = teachers.map<CreatePivotClassRoomSessionAndTeacherPayload>((tc) => ({
            class_session_id: sessionId,
            teacher_id: tc.id,
          }));
          acc = [...acc, ...teacherListWithSessionId];
        }
        return acc;
      }, []);
      const { data: sessionTeacher, error: sessionTeacherError } =
        await classRoomSessionRepository.createPivotClassSessionAndTeacher(createPivotClassSessionAndTeacherPayload);
      console.log("createdSucccess", classRoomData, sessionsData, employeeWithClassRoom, sessionTeacher);
      return classRoomData;
    },
  });

  const { mutate: doUpdateClassRoom, isPending: isPendingUpdate } = useTMutation({
    mutationKey: ["UPDATE_CLASS_ROOM"],
    mutationFn: async (payload: {
      classRoomId: string;
      formData: ClassRoom;
      teachers: ClassRoomStore["state"]["selectedTeachers"];
      students: ClassRoomStore["state"]["selectedStudents"];
    }) => {
      const { formData, teachers, students, classRoomId } = payload;
      const { data: classRoomDetail, error: classRoomDetailError } = await classRoomRepository.getClassRoomById(
        classRoomId,
      );
      if (!classRoomDetail || classRoomDetailError) {
        console.error("ClassRoom not found");
        return;
      }

      const {
        classRoomField,
        hashTags,
        classRoomSessions,
        communityInfo,
        galleries,
        description,
        thumbnailUrl,
        roomType,
        slug,
        status,
        title,
        faqs,
        forWhom,
        docs,
        whies,
      } = formData;

      const { startDate, endDate } = getStartDateAndEndDateFromClassSession(classRoomSessions, roomType);
      /**
       * Create ClassRoom first
       */
      const { data: classRoomData, error: updateError } = await classRoomRepository.upsertClassRoom({
        id: classRoomId,
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

      if (updateError) {
        console.error("Update Classroom Failed", updateError);
        throw new Error("Cập nhật lớp học thất bại.");
      }
      const faqMetadata = classRoomDetail.class_room_metadata.find((item) => item.key === "faqs");
      const { data: faqsData, error: faqsDataError } = await classRoomMetaRepository.upsertClassRoomMeta({
        id: faqMetadata?.id,
        class_room_id: classRoomData.id,
        key: "faqs",
        value: faqs.map((faq) => ({ answer: faq.answer, question: faq.question })),
      });
      if (faqsDataError) {
        console.log("Cập nhật Metadata FAQS thất bại", faqsDataError);
      }
      const whyMetadata = classRoomDetail.class_room_metadata.find((item) => item.key === "why");
      const { data: whyData, error: whyError } = await classRoomMetaRepository.upsertClassRoomMeta({
        id: whyMetadata?.id,
        class_room_id: classRoomData.id,
        key: "why",
        value: whies.map((item) => item.description),
      });

      if (whyError) {
        console.log("Cập nhật Metadata why thất bại", whyError);
      }

      const forWhomMetadata = classRoomDetail.class_room_metadata.find((item) => item.key === "forWhom");

      const { data: forWhomData, error: forWhomError } = await classRoomMetaRepository.upsertClassRoomMeta({
        id: forWhomMetadata?.id,
        class_room_id: classRoomData.id,
        key: "forWhom",
        value: forWhom.map((item) => item.description),
      });

      if (forWhomError) {
        console.log("Cập nhật Metadata forWhom thất bại", forWhomError);
      }

      const { data: galleriesData, error: galleriesDataError } = await classRoomMetaRepository.createClassRoomMeta({
        class_room_id: classRoomData.id,
        key: "galleries",
        value: galleries,
      });

      if (galleriesDataError) {
        console.log("Cập nhật Metadata galleries thất bại", galleriesDataError);
      }

      const pivotSudentWithClassRoomIds = classRoomDetail.employees.map((item) => item.id);

      await classRoomRepository.deletePivotClassRoomAndEmployee(pivotSudentWithClassRoomIds);
      const { data: employeeWithClassRoom, error: pivotEmployeeWithClassRoomError } =
        await classRoomRepository.createPivotClassRoomAndEmployee(
          students.map((tc) => ({
            class_room_id: classRoomData.id,
            employee_id: tc.id,
          })),
        );

      if (pivotEmployeeWithClassRoomError) {
        console.log("Cập nhật Students thất bại", pivotEmployeeWithClassRoomError);
      }

      /**
       * Handle update class room fields
       */
      const currentClassRoomFields = [...classRoomDetail.class_room_field];
      const currentClassFieldIds = currentClassRoomFields
        .map((item) => item.class_fields?.id)
        .filter((item) => !isUndefined(item));

      const classRoomFieldListAddition = classRoomField.filter((id) => !currentClassFieldIds.includes(id));

      const classRoomFieldListDeletation = currentClassRoomFields.filter((it) =>
        classRoomField.every((id) => id !== it.class_fields?.id),
      );

      if (classRoomFieldListAddition.length) {
        await classRoomRepository.createPivotClassRoomAndField(
          classRoomFieldListAddition.map((fieldId) => ({
            class_field_id: fieldId,
            class_room_id: classRoomData.id,
          })),
        );
      }
      if (classRoomFieldListDeletation.length) {
        await classRoomRepository.deletePivotClassRoomAndField(classRoomFieldListDeletation.map((it) => it.id));
      }

      /**
       * Handle update hashtag fields
       */
      const currentClassRoomTags = [...classRoomDetail.class_hash_tag];

      const currentClassClassRoomHashTagIds = currentClassRoomTags
        .map((item) => item.hash_tags?.id)
        .filter((item) => !isUndefined(item));

      const classRoomHashTagsAddition = hashTags.filter((id) => !currentClassClassRoomHashTagIds.includes(id));

      const classRoomHashTagsDeletation = currentClassRoomTags.filter((it) =>
        hashTags.every((id) => id !== it.hash_tags?.id),
      );

      if (classRoomHashTagsAddition.length) {
        await classRoomRepository.createPivotClassRoomAndHashTag(
          classRoomHashTagsAddition.map((hashTagId) => ({
            hash_tag_id: hashTagId,
            class_room_id: classRoomData.id,
          })),
        );
      }

      if (classRoomHashTagsDeletation.length) {
        await classRoomRepository.deletePivotClassRoomAndHashTag(classRoomHashTagsDeletation.map((it) => it.id));
      }

      /**
       * Create Sessions of classRooms
       */
      const classRoomSessionPayload = getClassRoomSessionPayload(classRoomSessions, roomType, title, description);
      const sessionIds = classRoomDetail.sessions.map((sesion) => sesion.id);

      await classRoomSessionRepository.deleteClassSession(sessionIds);
      const { data: sessionsData, error: sessionDataError } = await classRoomSessionRepository.createClassSession({
        classRoomId: classRoomData.id,
        sessions: classRoomSessionPayload,
      });
      if (!sessionsData) {
        console.log("Create Session failed", sessionDataError);
        return;
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
      await classRoomSessionRepository.createAgendasWithSession(createAgendasWithPayload);

      const createPivotClassSessionAndTeacherPayload = Object.entries(teachers).reduce<
        CreatePivotClassRoomSessionAndTeacherPayload[]
      >((acc, [_, teachers], _index) => {
        const sessionId = sessionsData[_index]?.id;
        if (sessionId) {
          const teacherListWithSessionId = teachers.map<CreatePivotClassRoomSessionAndTeacherPayload>((tc) => ({
            class_session_id: sessionId,
            teacher_id: tc.id,
          }));
          acc = [...acc, ...teacherListWithSessionId];
        }
        return acc;
      }, []);
      const { data: sessionTeacher, error: sessionTeacherError } =
        await classRoomSessionRepository.createPivotClassSessionAndTeacher(createPivotClassSessionAndTeacherPayload);

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
    onUpdate: doUpdateClassRoom,
    isLoading: isPending || isPendingUpdate,
  };
};
export { useCRUDClassRoom };
