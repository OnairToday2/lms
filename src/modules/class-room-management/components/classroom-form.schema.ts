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
  title: zod.string().min(1, { message: "Tên lớn học không bỏ trống." }).max(200, "Vui lòng nhập tối đa 200 ký tự"),
  description: zod.string(),
  thumbnailUrl: zod.string(),
  classRoomId: zod.string(),
  startDate: zod.date(),
  endDate: zod.string(),
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
  createdAt: zod.string(),
  updatedAt: zod.string(),
  agendas: zod.array(classRoomSessionAgendaSchema),
});

const classRoomSessionTeacherSchema = zod.object({
  id: zod.string(),
  name: zod.string().optional(),
});

const classRoomSchema = zod
  .object({
    title: zod.string().min(1, { message: "Tên lớn học không bỏ trống." }).max(200, "Vui lòng nhập tối đa 200 ký tự"),
    description: zod.string(),
    slug: zod.string(),
    thumbnailUrl: zod.string(),
    classRoomField: zod.array(zod.string()).min(1, "Chọn tối thiểu 1 lĩnh vực").max(3, "Lĩnh vực tối đa 3."),
    hashTags: zod.array(zod.string()),
    classRoomId: zod.string(),
    status: zod.enum(["publish", "draft"]),
    roomType: zod.enum(["single", "multiple"]),
    classRoomSessions: zod.array(classRoomSessionSchema),
    whies: zod.array(zod.string()),
    communityInfo: zod.object({
      name: zod.string(),
      url: zod.string(),
    }),
    faqs: zod.array(
      zod.object({
        id: zod.string().optional(),
        question: zod.string(),
        answer: zod.string(),
      }),
    ),
    forWhom: zod.array(
      zod.object({
        id: zod.string().optional(),
        description: zod.string(),
      }),
    ),
    galleries: zod.array(zod.string()),
  })
  .superRefine((formValues, context) => {
    if (formValues.faqs.length) {
      for (let i = 0; i < formValues.faqs.length; i++) {
        if (!formValues?.faqs[i]?.answer.length || !formValues?.faqs[i]?.answer) {
          context.addIssue({
            code: "custom",
            message: `faq ${i + 1} khong bo trong cau hoi`,
          });
        }
        if (!formValues?.faqs[i]?.question.length) {
          context.addIssue({
            code: "custom",
            message: `faq ${i + 1} khong bo trong cau tra loi`,
          });
        }
      }
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

// import { z as zod } from "zod";
// import { SurveyFieldOptionType, SurveyFieldType } from "@onair/repositories";

// export const SurveyQuestionFormFieldSchema = zod
// 	.object({
// 		type: zod.enum(
// 			[
// 				SurveyFieldType.CHECKBOX,
// 				SurveyFieldType.RADIO,
// 				SurveyFieldType.RATING,
// 				SurveyFieldType.SELECT,
// 				SurveyFieldType.TEXTAREA,
// 			],
// 			{ message: "type khong hop le" },
// 		),
// 		label: zod.string().min(1, { message: "Vui lòng nhập câu hỏi" }),
// 		placeholder: zod.string(),
// 		required: zod.boolean(),
// 		options: zod.array(
// 			zod
// 				.object({
// 					id: zod.string().optional(),
// 					label: zod.string(),
// 					type: zod.enum(
// 						[SurveyFieldOptionType.DEFAULT, SurveyFieldOptionType.OTHER],
// 						{ message: "Type invalid" },
// 					),
// 				})
// 				.superRefine((values, context) => {
// 					if (values.type === SurveyFieldOptionType.DEFAULT && !values.label) {
// 						context.addIssue({
// 							code: zod.ZodIssueCode.custom,
// 							message: "Vui lòng nhập lựa chọn.",
// 							path: ["label"],
// 						});
// 					} else if (
// 						values.type === SurveyFieldOptionType.OTHER &&
// 						values.label
// 					) {
// 						context.addIssue({
// 							code: zod.ZodIssueCode.custom,
// 							message: "Vui lòng không nhập gì.",
// 							path: ["label"],
// 						});
// 					}
// 				}),
// 		),
// 		id: zod.string().optional(),
// 	})
// 	.superRefine((values, context) => {
// 		if (
// 			(values.type === SurveyFieldType.CHECKBOX ||
// 				values.type === SurveyFieldType.RADIO ||
// 				values.type === SurveyFieldType.SELECT) &&
// 			!values.options.length
// 		) {
// 			context.addIssue({
// 				code: zod.ZodIssueCode.custom,
// 				message: "Vui lòng thêm lựa chọn với loại câu hỏi này.",
// 				path: ["options"],
// 			});
// 		}
// 	});

// export type SurveyFormActions = "Create" | "SoftCreate" | "Update";
// export const SurveyFormSchema = zod
// 	.object({
// 		action: zod.enum(["Create", "SoftCreate", "Update"]),
// 		title: zod
// 			.string()
// 			.min(1, { message: "Vui lòng nhập tiêu đề" })
// 			.max(200, "Vui lòng nhập tối đa 200 ký tự"),
// 		description: zod.string(),
// 		banner: zod.string(),
// 		fields: zod.array(SurveyQuestionFormFieldSchema),
// 	})
// 	.superRefine((values, context) => {
// 		if (values.action === "Create" || values.action === "Update") {
// 			if (!values.fields.length) {
// 				context.addIssue({
// 					code: zod.ZodIssueCode.custom,
// 					message: "Thêm ít nhất 1 câu hỏi.",
// 					path: ["fields"],
// 				});
// 			}
// 		}
// 	});
