import { supabase } from "@/services";
import type { Database } from "@/types/supabase.types";

export interface EmployeeListItem {
  id: string;
  employee_code: string;
  start_date: string | null;
  user_id: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
    gender: Database["public"]["Enums"]["gender"];
    birthday: string | null;
    avatar: string | null;
  } | null;
  employments: Array<{
    id: string;
    organization_unit_id: string;
    organization_units: {
      id: string;
      name: string;
      type: Database["public"]["Enums"]["organization_unit_type"];
    } | null;
  }>;
  managers_employees: Array<{
    manager_id: string;
  }>;
}

const getEmployees = async () => {
  const { data, error } = await supabase
    .from("employees")
    .select(`
      id,
      employee_code,
      start_date,
      user_id,
      created_at,
      profiles!profiles_employee_id_fkey (
        id,
        full_name,
        email,
        phone_number,
        gender,
        birthday,
        avatar
      ),
      employments (
        id,
        organization_unit_id,
        organization_units!employments_organization_unit_id_fkey (
          id,
          name,
          type
        )
      ),
      managers_employees!managers_employees_employee_id_fkey (
        manager_id
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch employees: ${error.message}`);
  }

  return data as unknown as EmployeeListItem[];
};

const getEmployeeById = async (id: string) => {
  const { data, error } = await supabase
    .from("employees")
    .select(`
      id,
      employee_code,
      start_date,
      user_id,
      created_at,
      profiles!profiles_employee_id_fkey (
        id,
        full_name,
        email,
        phone_number,
        gender,
        birthday,
        avatar
      ),
      employments (
        id,
        organization_unit_id,
        organization_units!employments_organization_unit_id_fkey (
          id,
          name,
          type
        )
      ),
      managers_employees!managers_employees_employee_id_fkey (
        manager_id
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch employee: ${error.message}`);
  }

  return data as unknown as EmployeeListItem;
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
  employee_code?: string;
  manager_id: string;
  role?: string;
  position_id?: string;
  start_date: string;
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
        employee_code: payload.employee_code || "",
        start_date: payload.start_date,
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

export interface UpdateEmployeePayload {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  gender: Database["public"]["Enums"]["gender"];
  birthday?: string | null;
  employee_code: string;
  department: string;
  branch?: string;
  manager_id: string;
  role?: string;
  position_id?: string;
  start_date: string;
}

const updateEmployee = async (payload: UpdateEmployeePayload) => {
  // Start a transaction-like operation by updating all related tables

  // 1. Update employee record
  const { error: employeeError } = await supabase
    .from("employees")
    .update({
      employee_code: payload.employee_code,
      start_date: payload.start_date,
    })
    .eq("id", payload.id);

  if (employeeError) {
    throw new Error(`Failed to update employee: ${employeeError.message}`);
  }

  // 2. Update profile record
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: payload.fullName,
      email: payload.email,
      phone_number: payload.phoneNumber || "",
      gender: payload.gender,
      birthday: payload.birthday || null,
    })
    .eq("employee_id", payload.id);

  if (profileError) {
    throw new Error(`Failed to update profile: ${profileError.message}`);
  }

  // 3. Handle employments - delete existing and create new ones
  // First, delete all existing employment records for this employee
  const { error: deleteError } = await supabase
    .from("employments")
    .delete()
    .eq("employee_id", payload.id);

  if (deleteError) {
    throw new Error(`Failed to delete old employments: ${deleteError.message}`);
  }

  // Create new employment records
  const employmentsToCreate = [];

  // Add department employment if provided
  if (payload.department) {
    employmentsToCreate.push({
      employee_id: payload.id,
      organization_unit_id: payload.department,
    });
  }

  // Add branch employment if provided and different from department
  if (payload.branch && payload.branch !== payload.department) {
    employmentsToCreate.push({
      employee_id: payload.id,
      organization_unit_id: payload.branch,
    });
  }

  if (employmentsToCreate.length > 0) {
    const { error: employmentsError } = await supabase
      .from("employments")
      .insert(employmentsToCreate);

    if (employmentsError) {
      throw new Error(`Failed to create employments: ${employmentsError.message}`);
    }
  }

  // 4. Handle manager-employee relationship
  // First, delete all existing manager relationships for this employee
  const { error: deleteManagerError } = await supabase
    .from("managers_employees")
    .delete()
    .eq("employee_id", payload.id);

  if (deleteManagerError) {
    throw new Error(`Failed to delete old manager relationships: ${deleteManagerError.message}`);
  }

  // Create new manager relationship if manager_id is provided
  if (payload.manager_id) {
    const { error: managerError } = await supabase
      .from("managers_employees")
      .insert({
        employee_id: payload.id,
        manager_id: payload.manager_id,
      });

    if (managerError) {
      throw new Error(`Failed to create manager relationship: ${managerError.message}`);
    }
  }

  // Return the updated employee
  return await getEmployeeById(payload.id);
};

export {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
};