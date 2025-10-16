import { forEach } from "lodash";
import * as zod from "zod";

const classRoomSessionAgendaSchema = zod.object({
  id: zod.string().optional(),
  title: zod.string().min(1, { message: "Tên lớn học không bỏ trống." }).max(200, "Vui lòng nhập tối đa 200 ký tự"),
  description: zod.string(),
  thumbnailUrl: zod.string(),
  classSessionId: zod.string(),
  startDate: zod.string(),
  endDate: zod.string(),
  createdAt: zod.string(),
  updatedAt: zod.string(),
});

const classRoomSessionSchema = zod.object({
  id: zod.string().optional(),
  title: zod.string().min(1, { message: "Tên lớn học không bỏ trống." }).max(100, "Vui lòng nhập tối đa 200 ký tự"),
  description: zod.string().min(1, { message: "Tên lớn học không bỏ trống." }),
  thumbnailUrl: zod.string().min(1, { message: "Tên lớn học không bỏ trống." }),
  startDate: zod.iso.datetime({ error: "Ngày bắt đầu không hợp lệ." }),
  endDate: zod.iso.datetime({ error: "Ngày kết thúc không hợp lệ." }),
  recourses: zod.array(
    zod.object({
      id: zod.string(),
    }),
  ),
  isOnline: zod.boolean(),
  channelProvider: zod.enum(["zoom", "google_meet", "microsoft_teams"]),
  channelInfo: zod.object({
    providerId: zod.string(),
    url: zod.string(),
    password: zod.string(),
  }),
  limitPerson: zod.number(),
  isUnlimited: zod.boolean(),
  agendas: zod.array(classRoomSessionAgendaSchema),
});

const classRoomSessionTeacherSchema = zod.object({
  id: zod.string(),
  name: zod.string().optional(),
});

const classRoomSchema = zod.object({
  title: zod.string().min(1, { message: "Tên lớn học không bỏ trống." }).max(200, "Vui lòng nhập tối đa 200 ký tự"),
  description: zod.string(),
  slug: zod.string(),
  thumbnailUrl: zod
    .string()
    .min(1, { error: "Ảnh bìa không bỏ trống." })
    .superRefine((value, ctx) => {
      if (!value.startsWith("http://"))
        ctx.addIssue({
          code: "invalid_format",
          format: "starts_with",
          message: "Đường dẫn không hợp lệ.",
        });
    }),
  classRoomField: zod.array(zod.string()).min(1, "Chọn tối thiểu 1 lĩnh vực").max(3, "Lĩnh vực tối đa 3."),
  hashTags: zod.array(zod.string()),
  classRoomId: zod.string(),
  status: zod.enum(["publish", "draft"]),
  roomType: zod.enum(["single", "multiple"]),
  classRoomSessions: zod.array(classRoomSessionSchema),
  whies: zod.array(zod.string()),
  communityInfo: zod.object({
    name: zod.string(),
    url: zod.url({ protocol: /^https?$/, error: "Đường dẫn không hợp lệ." }),
  }),
  faqs: zod
    .array(
      zod.object({
        id: zod.string().optional(),
        question: zod.string(),
        answer: zod.string(),
      }),
    )
    .superRefine((values, context) => {
      if (values.length) {
        values.forEach((v, i) => {
          if (!values[i]?.answer.length || !values[i]?.answer) {
            context.addIssue({
              code: "custom",
              message: `Không bỏ trống câu hỏi.`,
              path: [i, "answer"],
            });
          }
          if (!values[i]?.question.length) {
            context.addIssue({
              code: "custom",
              message: `Không bỏ trống câu trả lời.`,
              path: [i, "question"],
            });
          }
        });
      }
    }),
  forWhom: zod.array(
    zod.object({
      id: zod.string().optional(),
      description: zod.string(),
    }),
  ),
  galleries: zod.array(zod.string()).superRefine((values, ctx) => {
    if (values.length)
      values.forEach((v, i) => {
        if (!v.startsWith("http://")) {
          ctx.addIssue({
            code: "invalid_format",
            format: "starts_with",
            message: `Đường dẫn ${i} không hợp lệ.`,
          });
        }
      });
  }),
});

type ClassRoomSession = zod.infer<typeof classRoomSessionSchema>;
type ClassRoomSessionTeacher = zod.infer<typeof classRoomSessionTeacherSchema>;
type ClassRoom = zod.infer<typeof classRoomSchema>;

export {
  classRoomSessionTeacherSchema,
  classRoomSessionSchema,
  classRoomSchema,
  type ClassRoomSession,
  type ClassRoomSessionTeacher,
  type ClassRoom,
};
