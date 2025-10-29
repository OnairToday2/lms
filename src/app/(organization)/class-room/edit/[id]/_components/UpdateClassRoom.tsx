"use client";
import ManageClassRoomForm, {
  ManageClassRoomFormProps,
  ManageClassRoomFormRef,
} from "@/modules/class-room-management/components/ManageClassRoomForm";
import { useCRUDClassRoom } from "@/modules/class-room-management/hooks/useCRUDClassRoom";
import { useMemo, useRef } from "react";
import { GetClassRoomByIdData } from "../page";
import { getClassRoomMetaValue } from "@/modules/class-room-management/utils";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
interface UpdateClassRoomProps {
  data: Exclude<GetClassRoomByIdData, null>;
}
type UpdateClassRoomFormValue = Exclude<ManageClassRoomFormProps["initFormValue"], undefined>;
type ClassRoomSession = UpdateClassRoomFormValue["classRoomSessions"][number];
type SessionAgenda = UpdateClassRoomFormValue["classRoomSessions"][number]["agendas"][number];

type TeacherType = Exclude<ManageClassRoomFormProps["teachers"], undefined>;
type StudentType = Exclude<ManageClassRoomFormProps["students"], undefined>;

const UpdateClassRoom: React.FC<UpdateClassRoomProps> = ({ data }) => {
  const router = useRouter();
  const { sessions, class_room_metadata, employees } = data;
  const { enqueueSnackbar } = useSnackbar();
  const formClassRoomRef = useRef<ManageClassRoomFormRef>(null);
  const { isLoading, onUpdate } = useCRUDClassRoom();

  const updateClassRoomFormData = useMemo<UpdateClassRoomFormValue>(() => {
    const hastTags = data?.class_hash_tag.reduce<string[]>((acc, ht) => {
      const hastTagId = ht.hash_tags?.id;
      return hastTagId ? [...acc, hastTagId] : acc;
    }, []);

    const classRoomFields = data?.class_room_field.reduce<string[]>((acc, item) => {
      const fieldId = item.class_fields?.id;
      return fieldId ? [...acc, fieldId] : acc;
    }, []);

    const communityInfo: UpdateClassRoomFormValue["communityInfo"] = {
      name: data.comunity_info?.name || "",
      url: data.comunity_info?.url || "",
    };
    const classRoomSessions = sessions.reduce<ClassRoomSession[]>((acc, session) => {
      const channelInfo = {
        providerId: session.channel_info?.providerId || "",
        url: session.channel_info?.url || "",
        password: session.channel_info?.password || "",
      };

      const agendas = session.agendas.map<SessionAgenda>((agenda) => ({
        endDate: agenda.end_at ? dayjs(session.end_at).toISOString() : "",
        startDate: agenda.start_at ? dayjs(session.start_at).toISOString() : "",
        title: agenda.title || "",
        description: agenda.description || "",
      }));

      return [
        ...acc,
        {
          id: data.id,
          title: session.title || "",
          description: session.description || "",
          thumbnailUrl: "",
          endDate: session.end_at ? dayjs(session.end_at).toISOString() : "",
          startDate: session.start_at ? dayjs(session.start_at).toISOString() : "",
          isOnline: session.is_online || false,
          channelProvider: session.channel_provider || "zoom",
          channelInfo: channelInfo,
          teachers: [],
          resources: [],
          limitPerson: session.limit_person || -1,
          isUnlimited: session.limit_person === -1 ? true : false,
          agendas: agendas,
          isLimitTimeScanQrCode: true,
          platform: "online",
          qrCode: {
            startDate: "",
            endDate: "",
          },
        } as UpdateClassRoomFormValue["classRoomSessions"][number],
      ];
    }, []);

    const faqs = getClassRoomMetaValue(class_room_metadata, "faqs");
    const galleries = getClassRoomMetaValue(class_room_metadata, "galleries");
    const whies = getClassRoomMetaValue(class_room_metadata, "why");
    const forWhom = getClassRoomMetaValue(class_room_metadata, "forWhom");

    return {
      title: data.title || "",
      slug: data.slug || "",
      description: data.description || "",
      classRoomSessions: classRoomSessions,
      thumbnailUrl: data.thumbnail_url || "",
      hashTags: hastTags,
      classRoomField: classRoomFields,
      docs: [],
      faqs: faqs || [],
      whies: whies ? whies.map((item) => ({ description: item })) : [],
      forWhom: forWhom ? forWhom.map((item) => ({ description: item })) : [],
      galleries: galleries || [],
      communityInfo: communityInfo,
      status: data.status,
      roomType: data.room_type || "single",
      classRoomId: data.id,
      platform: "online",
    };
  }, [data]);

  const teacherList = useMemo(() => {
    return sessions.reduce<TeacherType>((acc, session, _index) => {
      return {
        ...acc,
        [_index]: session.teachers.reduce<TeacherType[0]>((teacherSumary, tc) => {
          if (tc.employee && tc.employee.employee_type === "teacher") {
            teacherSumary = [
              ...teacherSumary,
              {
                avatar: tc.employee?.profile?.avatar || "",
                email: tc.employee?.profile?.email || "",
                id: tc.employee?.id,
                fullName: tc.employee?.profile?.full_name || "",
                employeeCode: tc.employee.employee_code || "",
                empoyeeType: tc.employee.employee_type,
              },
            ];
          }
          return teacherSumary;
        }, []),
      };
    }, {});
  }, [sessions]);

  const studentList = useMemo(() => {
    return employees.reduce<StudentType>((acc, emp) => {
      if (emp.employee && emp.employee.employee_type === "student") {
        acc = [
          ...acc,
          {
            id: emp.employee.id,
            avatar: emp.employee.profile?.avatar || "",
            email: emp.employee.profile?.email || "",
            employeeCode: emp.employee.employee_code,
            empoyeeType: emp.employee.employee_type,
            fullName: emp.employee.profile?.full_name || "",
          },
        ];
      }
      return acc;
    }, []);
  }, [employees]);
  const handleUpdateClassRoom: ManageClassRoomFormProps["onSubmit"] = (formData, students, teachers) => {
    onUpdate(
      { classRoomId: data.id, formData, students, teachers },
      {
        onSuccess(data, variables, onMutateResult, context) {
          enqueueSnackbar("Cập nhật lớp học thành công..", { variant: "success" });
          formClassRoomRef.current?.resetForm();
          router.refresh();
        },
      },
    );
  };

  return (
    <ManageClassRoomForm
      initFormValue={updateClassRoomFormData}
      action="edit"
      students={studentList}
      teachers={teacherList}
      isLoading={isLoading}
      onSubmit={handleUpdateClassRoom}
      ref={formClassRoomRef}
    />
  );
};
export default UpdateClassRoom;
