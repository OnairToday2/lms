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

};

export {
  getEmployees,
  createEmployee,
};