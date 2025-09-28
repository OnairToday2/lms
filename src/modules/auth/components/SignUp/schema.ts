import zod from "zod";

export const SignUpSchema = zod.object({
  fullName: zod.string().trim().min(3, { message: "Vui long nhap ten" }),
  email: zod.email().min(1, { message: "Vui long nhap email" }),
  password: zod.string().min(1, "Vui long nhap mat khau"),
});

export type TSignUpForm = zod.infer<typeof SignUpSchema>;
