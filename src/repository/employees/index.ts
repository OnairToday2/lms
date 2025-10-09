import { supabase } from "@/services";
import type { Database } from "@/types/supabase.types";

const getEmployees = async () => {
  const response = await supabase.from("profiles").select("*");

  return response.data;
};

export interface CreateEmployeePayload {
  // Personal Information
  email: string;
  fullName: string;
  phoneNumber?: string;
  gender: Database["public"]["Enums"]["gender"];
  birthday?: string | null;

  // Work Information
  branch?: string;
  department: string;
  employee_code: string;
  manager_id: string;
  role?: string;
  position_id?: string;
  start_date?: string | null;
}

const createEmployee = async (payload: CreateEmployeePayload) => {
  // Generate a temporary password for the new employee
  const temporaryPassword = "123123123aA";

  // Sign up the user with metadata that will be used by the database trigger
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: temporaryPassword,
    options: {
      data: {
        // Personal Information
        full_name: payload.fullName,
        phone_number: payload.phoneNumber || "",
        gender: payload.gender,
        birthday: payload.birthday || null,

        // Work Information
        employee_code: payload.employee_code,
        start_date: payload.start_date || null,
        department_id: payload.department,
        branch_id: payload.branch || null,
        manager_id: payload.manager_id,
        role: payload.role || null,
        position_id: payload.position_id || null,
      },
    },
  });

  if (error) {
    throw new Error(`Failed to create employee: ${error.message}`);
  }

  if (!data.user) {
    throw new Error("Failed to create employee: No user data returned");
  }

  return {
    user: data.user,
    temporaryPassword,
  };
};

export {
  getEmployees,
  createEmployee,
};