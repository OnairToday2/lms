import { classRoomRepository } from "@/repository";
import { ClassRoom } from "@/model/class-room.model";
import { Organization } from "@/model/organization.model";
import { Employee } from "@/model/employee.model";
import { ClassSession } from "@/model/class-session.model";
import { email } from "zod";

const getClassRoomById = async (classRoomId: string) => {
  const { data, error } = await classRoomRepository.getClassRoomById(classRoomId);

  if (data) {
    const classSession = data.sessions.map((session) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      channelInfo: session.channel_info,
      channelProvider: session.channel_provider,
      endAt: session.end_at,
      startAt: session.start_at,
      classRoomId: session.class_room_id,
      isOnline: session.is_online,
      limitPerson: session.limit_person,
      teachers: session.teachers
        ? session.teachers.map((teacher) => {
            return {
              id: teacher.id,
              fullName: teacher.employee?.profile?.full_name,
              avatar: teacher.employee?.profile?.avatar,
              email: teacher.employee?.profile?.email,
            };
          })
        : null,
      agendas: session.agendas,
    }));

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      roomType: data.room_type,
      startAt: data.start_at,
      endAt: data.end_at,
      status: data.status,
      sessions: classSession,
      organization: data.organizations
        ? {
            id: data.organizations.id,
            name: data.organizations.name,
          }
        : null,
      employees: data.employees?.map((emp) => ({
        id: emp.employee?.id,
        employeeType: emp.employee?.employee_type,
        email: emp.employee?.profile?.email,
        fullName: emp.employee?.profile?.full_name,
        avatar: emp.employee?.profile?.avatar,
      })),
    };
  }

  return { error, data };
};
