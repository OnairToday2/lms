import { LessionType } from "@/model/lession.model";
import * as zod from "zod";

const courseLessionSchema = zod.object({
  id: zod.string().optional(),
  title: zod.string().min(1, { message: "Tiêu đề không bỏ trống." }).max(200, "Tiêu đề tối đa 200 ký tự."),
  content: zod.string().min(1, { message: "Nội dung không bỏ trống." }),
  status: zod.enum(["active", "deactive"]),
  mainResource: zod.object({
    id: zod.string(),
    url: zod.string(),
    type: zod.string(),
  }),
  resources: zod.array(
    zod.object({
      id: zod.string(),
      url: zod.string(),
      type: zod.string(),
    }),
  ),
  lessionType: zod.enum(["file", "video", "assessment"]),
});

const courseSectionSchema = zod.object({
  id: zod.string().optional(),
  title: zod.string(),
  description: zod.string(),
  lessions: zod.array(courseLessionSchema),
  status: zod.enum(["active", "deactive"]),
});

const upsertCourseSchema = zod.object({
  courseId: zod.string(),
  title: zod.string().min(1, { message: "Tên môn học không bỏ trống." }).max(200, "Vui lòng nhập tối đa 200 ký tự"),
  description: zod.string().min(1, { error: "Không bỏ trống nội dung." }),
  slug: zod.string(),
  startAt: zod.string(),
  endAt: zod.string(),
  thumbnailUrl: zod
    .string()
    .min(1, { error: "Ảnh bìa không bỏ trống." })
    .superRefine((value, ctx) => {
      if (!value.startsWith("http://") && !value.startsWith("https://")) {
        ctx.addIssue({
          code: "invalid_format",
          format: "thumbnailUrl",
          message: "Đường dẫn không hợp lệ.",
        });
      }
    }),
  categories: zod
    .array(zod.string())
    .min(1, "Chọn tối thiểu 1 lĩnh vực và tối đa 3 lĩnh vực.")
    .max(3, "Chọn tối thiểu 1 lĩnh vực và tối đa 3 lĩnh vực."),
  status: zod.enum(["publish", "draft", "pending", "deleted", "active", "deactive"]),
  sections: zod.array(courseSectionSchema),
  benefits: zod
    .array(
      zod.object({
        content: zod.string(),
      }),
    )
    .superRefine((values, context) => {
      if (values.length) {
        values.forEach(({ content }, i) => {
          if (!content.length) {
            context.addIssue({
              code: "custom",
              message: `Không bỏ trống.`,
              path: [i, "content"],
            });
          }
        });
      }
    }),
  docs: zod
    .array(
      zod.object({
        type: zod.string(),
        fileExtension: zod.string(),
        size: zod
          .number()
          .positive()
          .max(5 * 1024 * 1024, "Dung lượng file không vượt quá 5mb"),
        url: zod.string(),
      }),
    )
    .optional(),
});

type CourseSectionFormData = zod.infer<typeof courseSectionSchema>;
type UpsertCourseFormData = zod.infer<typeof upsertCourseSchema>;

export { courseSectionSchema, upsertCourseSchema, type CourseSectionFormData, type UpsertCourseFormData };
