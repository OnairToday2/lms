import * as zod from "zod";

const assignmentSchema = zod.object({
  name: zod.string().min(1, { message: "Tên bài kiểm tra không bỏ trống." }).max(200, "Vui lòng nhập tối đa 200 ký tự"),
  description: zod.string().min(1, { message: "Mô tả bài kiểm tra không bỏ trống." }),
  assignmentCategories: zod
    .array(zod.string())
    .min(1, "Chọn tối thiểu 1 lĩnh vực.")
    .max(3, "Chọn tối đa 3 lĩnh vực."),
});

type Assignment = zod.infer<typeof assignmentSchema>;

export { assignmentSchema, type Assignment };

