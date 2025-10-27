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
import { StudentSelectedItem, TeacherSelectedItem } from "@/modules/class-room-management/store/class-room-store";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
interface UpdateClassRoomProps {
  data: Exclude<GetClassRoomByIdData, null>;
}
type UpdateFormValue = Exclude<ManageClassRoomFormProps["value"], undefined>;
type ClassRoomSession = UpdateFormValue["formData"]["classRoomSessions"][number];
type SessionAgenda = UpdateFormValue["formData"]["classRoomSessions"][number]["agendas"][number];

const UpdateClassRoom: React.FC<UpdateClassRoomProps> = ({ data }) => {
  const router = useRouter();
  const { sessions, class_room_metadata, employees } = data;
  const { enqueueSnackbar } = useSnackbar();
  const formClassRoomRef = useRef<ManageClassRoomFormRef>(null);
  const { isLoading, onUpdate } = useCRUDClassRoom();

  const updateClassRoomFormData = useMemo(() => {
    const hastTags = data?.class_hash_tag.reduce<string[]>((acc, ht) => {
      const hastTagId = ht.hash_tags?.id;
      return hastTagId ? [...acc, hastTagId] : acc;
    }, []);

    const classRoomFields = data?.class_room_field.reduce<string[]>((acc, item) => {
      const fieldId = item.class_fields?.id;
      return fieldId ? [...acc, fieldId] : acc;
    }, []);

    const communityInfo: UpdateFormValue["formData"]["communityInfo"] = {
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
        },
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
      roomType: data.room_type,
      classRoomId: data.id,
    };
  }, [data]);

  const selectedTeachers = useMemo<UpdateFormValue["selectedTeachers"]>(() => {
    return sessions.reduce<UpdateFormValue["selectedTeachers"]>((acc, session, _index) => {
      return {
        ...acc,
        [_index]: session.teachers.reduce<TeacherSelectedItem[]>((teacherSumary, tc) => {
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
  const selectedStudents = useMemo<UpdateFormValue["selectedStudents"]>(() => {
    return employees.reduce<StudentSelectedItem[]>((acc, emp) => {
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
      value={{
        formData: updateClassRoomFormData,
        selectedStudents: selectedStudents,
        selectedTeachers: selectedTeachers,
      }}
      isLoading={isLoading}
      onSubmit={handleUpdateClassRoom}
      ref={formClassRoomRef}
    />
  );
};
export default UpdateClassRoom;
