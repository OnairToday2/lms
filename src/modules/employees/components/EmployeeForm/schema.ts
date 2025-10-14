import { z } from "zod";
import { Constants } from "@/types/supabase.types";

const genderValues = Constants.public.Enums.gender;

// Role options for the dropdown
export const ROLE_OPTIONS = [
  "Nhân viên",
  "Trưởng nhóm",
  "Quản lý",
  "Giám đốc",
] as const;

export const EmployeeFormSchema = z.object({
  email: z
    .email()
    .min(1, { message: "Vui lòng nhập email" }),
  full_name: z
    .string()
    .trim()
    .min(1, { message: "Vui lòng nhập họ và tên" })
    .min(3, { message: "Họ và tên phải có ít nhất 3 ký tự" }),
  phone_number: z
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

  // Work Information
  branch: z.string().optional(),
  department: z.string().min(1, { message: "Vui lòng chọn phòng ban" }),
  employee_code: z.string().optional(),
  manager_id: z.string().min(1, { message: "Vui lòng chọn người quản lý" }),
  role: z.string().optional(),
  position_id: z.string().optional(),
  start_date: z.string().min(1, { message: "Vui lòng chọn ngày bắt đầu" }),
});

export type EmployeeFormData = z.infer<typeof EmployeeFormSchema>;

