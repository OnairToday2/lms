"use client";
import ManageClassRoomForm, {
  ManageClassRoomFormProps,
  ManageClassRoomFormRef,
} from "@/modules/class-room-management/components/ManageClassRoomForm";
import { useCRUDClassRoom } from "@/modules/class-room-management/hooks/useCRUDClassRoom";
import { useMemo, useRef } from "react";
import { GetClassRoomByIdData } from "../page";
import { getClassRoomMetaValue } from "@/modules/class-room-management/utils";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
interface UpdateClassRoomProps {
  data: Exclude<GetClassRoomByIdData, null>;
}
type UpdateFormValue = Exclude<ManageClassRoomFormProps["value"], undefined>;
type ClassRoomSession = UpdateFormValue["formData"]["classRoomSessions"][number];
type SessionAgenda = UpdateFormValue["formData"]["classRoomSessions"][number]["agendas"][number];

const UpdateClassRoom: React.FC<UpdateClassRoomProps> = ({ data }) => {
  const { sessions, thumbnail_url, title, description, class_room_metadata } = data;
  const { enqueueSnackbar } = useSnackbar();
  const formClassRoomRef = useRef<ManageClassRoomFormRef>(null);
  const { onCreate, isLoading } = useCRUDClassRoom();

  const updateClassRoomFormData = useMemo<UpdateFormValue["formData"]>(() => {
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
        endDate: agenda.end_at || "",
        startDate: agenda.start_at || "",
        title: agenda.title || "",
        description: agenda.description || "",
      }));

      return [
        ...acc,
        {
          id: "",
          title: session.title || "",
          description: session.description || "",
          thumbnailUrl: "",
          endDate: session.end_at || "",
          startDate: session.start_at || "",
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

  const handleUpdateClassRoom: ManageClassRoomFormProps["onSubmit"] = (formData, students, teachers) => {
    //  onCreate(
    //    { formData, employees: students },
    //    {
    //      onSuccess(data, variables, onMutateResult, context) {
    //        enqueueSnackbar("Cap nhat lớp học thành công.", {variant: "success"});
    //        formClassRoomRef.current?.resetForm();
    //      },
    //    },
    //  );
  };

  return (
    <ManageClassRoomForm
      value={{
        formData: updateClassRoomFormData,
        selectedStudents: [],
        selectedTeachers: {},
      }}
      onSubmit={handleUpdateClassRoom}
      ref={formClassRoomRef}
    />
  );
};
export default UpdateClassRoom;
