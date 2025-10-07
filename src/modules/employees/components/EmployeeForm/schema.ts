import { z } from "zod";
import { Constants } from "@/types/supabase.types";

// Extract gender enum values from database schema
const genderValues = [...Constants.public.Enums.gender] as [string, ...string[]];

export const EmployeeFormSchema = z.object({
  email: z
    .email()
    .min(1, { message: "Vui lòng nhập email" }),
  fullName: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập họ và tên" })
    .min(3, { message: "Họ và tên phải có ít nhất 3 ký tự" }),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        return /^[0-9]{10,11}$/.test(val);
      },
      {
        message: "Số điện thoại phải có 10-11 chữ số",
      }
    ),
  gender: z.enum(genderValues, {
    message: "Vui lòng chọn giới tính",
  }),
  birthday: z.string().nullable().optional(),
});

export type EmployeeFormData = z.infer<typeof EmployeeFormSchema>;

