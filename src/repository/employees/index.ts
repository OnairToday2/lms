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
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: payload.email,
    password: "123123123", // Temporary password
  });

  if (authError) {
    throw new Error(`Failed to create user: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error("Failed to create user: No user data returned");
  }

  const userId = authData.user.id;

  try {
    const { data: employeeData, error: employeeError } = await supabase
      .from("employees")
      .insert({
        user_id: userId,
        start_date: payload.start_date || null,
      })
      .select()
      .single();

    if (employeeError) {
      throw new Error(`Failed to create employee: ${employeeError.message}`);
    }

    const employeeId = employeeData.id;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        employee_id: employeeId,
        full_name: payload.fullName,
        phone_number: payload.phoneNumber || "",
        gender: payload.gender,
        birthday: payload.birthday || null,
      })
      .select()
      .single();

    if (profileError) {
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }

    const { data: employmentData, error: employmentError } = await supabase
      .from("employments")
      .insert({
        employee_id: employeeId,
        organization_unit_id: payload.department,
      })
      .select()
      .single();

    if (employmentError) {
      throw new Error(`Failed to create employment: ${employmentError.message}`);
    }

    return {
      employee: employeeData,
      profile: profileData,
      employment: employmentData,
    };
  } catch (error) {
    // If any step fails, we should ideally clean up the created records
    // For now, we'll just throw the error
    throw error;
  }
};

export {
  getEmployees,
  createEmployee,
};