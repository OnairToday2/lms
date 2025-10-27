import { ClassRoomStatus } from "@/model/class-room.model";
import dayjs from "dayjs";
import * as zod from "zod";

const classRoomSessionAgendaSchema = zod.object({
  id: zod.string().optional(),
  title: zod.string().min(1, { message: "Tiêu đề không bỏ trống." }).max(100, "Tiêu đề tối đa 200 ký tự."),
  description: zod.string().min(1, { message: "Nội dung không bỏ trống." }),
  startDate: zod.iso.datetime({ error: "Ngày bắt đầu không hợp lệ." }),
  endDate: zod.iso.datetime({ error: "Ngày bắt đầu không hợp lệ." }),
});

const classRoomSessionSchema = zod
  .object({
    id: zod.string().optional(),
    title: zod.string(),
    description: zod.string(),
    thumbnailUrl: zod.string(),
    startDate: zod.iso.datetime({ error: "Ngày bắt đầu không hợp lệ." }),
    endDate: zod.iso.datetime({ error: "Ngày kết thúc không hợp lệ." }),
    resources: zod.array(
      zod.object({
        id: zod.string(),
      }),
    ),
    isOnline: zod.boolean(),
    channelProvider: zod.enum(["zoom", "google_meet", "microsoft_teams"]),
    channelInfo: zod
      .object({
        providerId: zod.string(),
        url: zod.string().min(1, { error: "Link tham dự không bỏ trống" }),
        password: zod.string(),
      })
      .superRefine((value, ctx) => {
        if (!value.url.startsWith("http://") && !value.url.startsWith("https://")) {
          ctx.addIssue({
            code: "custom",
            message: "Link tham dự không hợp lệ.",
            path: ["url"],
          });
        }
      }),
    limitPerson: zod.number(),
    isUnlimited: zod.boolean(),
    agendas: zod.array(classRoomSessionAgendaSchema),
  })
  .superRefine(({ limitPerson, isUnlimited, startDate, endDate }, ctx) => {
    if (!isUnlimited) {
      if (limitPerson <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Số lượng tối thiểu lớn hơn 0.",
          path: ["limitPerson"],
        });
      }
      if (limitPerson > 99) {
        ctx.addIssue({
          code: "custom",
          message: "Số lượng tối đa nhỏ hơn 99.",
          path: ["limitPerson"],
        });
      }
    }
    if (dayjs(startDate).isAfter(endDate)) {
      ctx.addIssue({
        code: "custom",
        message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc.",
        path: ["startDate"],
      });
    }
  });

const classRoomSessionTeacherSchema = zod.object({
  id: zod.string(),
  name: zod.string().optional(),
});

const classRoomSchema = zod
  .object({
    title: zod.string().min(1, { message: "Tên lớp học không bỏ trống." }).max(200, "Vui lòng nhập tối đa 200 ký tự"),
    description: zod.string().min(1, { error: "Không bỏ trống nội dung." }),
    slug: zod.string(),
    thumbnailUrl: zod
      .string()
      .min(1, { error: "Ảnh bìa không bỏ trống." })
      .superRefine((value, ctx) => {
        if (!value.startsWith("http://") && !value.startsWith("https://")) {
          ctx.addIssue({
            code: "invalid_format",
            format: "starts_with",
            message: "Đường dẫn không hợp lệ.",
          });
        }
      }),
    classRoomField: zod
      .array(zod.string())
      .min(1, "Chọn tối thiểu 1 lĩnh vực và tối đa 3 lĩnh vực.")
      .max(3, "Chọn tối thiểu 1 lĩnh vực và tối đa 3 lĩnh vực."),
    hashTags: zod.array(zod.string()),
    classRoomId: zod.string(),
    status: zod.enum(["publish", "draft", "pending", "deleted", "active", "deactive"]),
    roomType: zod.enum(["single", "multiple"]),
    classRoomSessions: zod.array(classRoomSessionSchema),
    communityInfo: zod.object({
      name: zod.string(),
      url: zod.string().superRefine((value, ctx) => {
        if (value.length) {
          if (!value.startsWith("http://") && !value.startsWith("https://")) {
            ctx.addIssue({
              code: "invalid_format",
              format: "starts_with",
              message: "Đường dẫn không hợp lệ. URL phải bắt đầu bằng http:// hoặc https://",
            });
          }
        }
      }),
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
          values.forEach(({ answer, question }, i) => {
            if (!answer.length || !answer) {
              context.addIssue({
                code: "custom",
                message: `Không bỏ trống câu hỏi.`,
                path: [i, "answer"],
              });
            }
            if (!question.length) {
              context.addIssue({
                code: "custom",
                message: `Không bỏ trống câu trả lời.`,
                path: [i, "question"],
              });
            }
          });
        }
      }),
    forWhom: zod
      .array(
        zod.object({
          id: zod.string().optional(),
          description: zod.string(),
        }),
      )
      .superRefine((values, context) => {
        if (values.length) {
          values.forEach(({ description }, i) => {
            if (!description.length) {
              context.addIssue({
                code: "custom",
                message: `Không bỏ trống.`,
                path: [i, "description"],
              });
            }
          });
        }
      }),
    docs: zod.array(
      zod.object({
        type: zod.string(),
        size: zod.number(),
        url: zod.string(),
      }),
    ),
    whies: zod
      .array(
        zod.object({
          id: zod.string().optional(),
          description: zod.string(),
        }),
      )
      .superRefine((values, context) => {
        if (values.length) {
          values.forEach(({ description }, i) => {
            if (!description.length) {
              context.addIssue({
                code: "custom",
                message: `Không bỏ trống.`,
                path: [i, "description"],
              });
            }
          });
        }
      }),
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
  })
  .superRefine(({ roomType, classRoomSessions }, ctx) => {
    if (roomType === "multiple") {
      classRoomSessions.forEach((clrs, _index) => {
        if (!clrs.title.length) {
          ctx.addIssue({
            code: "custom",
            message: "Tiêu đề không bỏ trống.",
            path: ["classRoomSessions", _index, "title"],
          });
        }

        if (!clrs.description.length) {
          ctx.addIssue({
            code: "custom",
            message: "Nội dung không bỏ trống",
            path: ["classRoomSessions", _index, "description"],
          });
        }
      });
    }
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
