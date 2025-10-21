import { supabase } from "@/services";
import { createSVClient } from "@/services";
import type { EmployeeDto, GetEmployeesParams } from "@/types/dto/employees";
import type { PaginatedResult } from "@/types/dto/pagination.dto";

const getEmployees = async (params?: GetEmployeesParams): Promise<PaginatedResult<EmployeeDto>> => {
  const page = params?.page ?? 0;
  const pageSize = params?.pageSize ?? 12;
  const search = params?.search?.trim();
  const departmentId = params?.departmentId;

  let query = supabase
    .from("employees")
    .select(`
      id,
      employee_code,
      start_date,
      position_id,
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
    `, { count: 'exact' });

  if (search) {
    query = query.or(`employee_code.ilike.%${search}%,profiles.full_name.ilike.%${search}%,profiles.email.ilike.%${search}%`);
  }

  if (departmentId && departmentId !== 'all') {
    query = query.filter('employments.organization_unit_id', 'eq', departmentId);
  }

  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch employees: ${error.message}`);
  }

  return {
    data: (data as unknown as EmployeeDto[]) || [],
    total: count ?? 0,
    page,
    pageSize,
  };
};

const getEmployeeById = async (id: string) => {
  const { data, error } = await supabase
    .from("employees")
    .select(`
      id,
      employee_code,
      start_date,
      position_id,
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

  return data as unknown as EmployeeDto;
};

export async function getLastEmployeeOrder() {
  const supabase = await createSVClient();

  const { data: lastEmployee, error: orderError } = await supabase
    .from("employees")
    .select("employee_order")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (orderError && orderError.code !== "PGRST116") {
    throw new Error(`Failed to get last employee order: ${orderError.message}`);
  }

  return lastEmployee?.employee_order ?? 0;
}

export async function createEmployee(data: {
  user_id: string;
  employee_code: string;
  employee_order: number;
  start_date: string;
  position_id?: string | null;
  status: Database["public"]["Enums"]["employee_status"];
}) {
  const supabase = await createSVClient();

  const { data: employee, error } = await supabase
    .from("employees")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create employee: ${error.message}`);
  }

  return employee;
}

export async function updateEmployeeById(
  id: string,
  data: {
    employee_code?: string;
    start_date?: string;
    position_id?: string | null;
  }
) {
  const supabase = await createSVClient();

  const { error } = await supabase
    .from("employees")
    .update(data)
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update employee: ${error.message}`);
  }
}

export async function getEmployeeUserId(employeeId: string) {
  const supabase = await createSVClient();

  const { data: employee, error } = await supabase
    .from("employees")
    .select("user_id")
    .eq("id", employeeId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch employee: ${error.message}`);
  }

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee.user_id;
}

export async function deleteEmployeeById(employeeId: string) {
  const supabase = await createSVClient();

  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", employeeId);

  if (error) {
    throw new Error(`Failed to delete employee: ${error.message}`);
  }
}

export async function findEmployeesByEmployeeCodes(employeeCodes: string[]) {
  const supabase = await createSVClient();

  const { data, error } = await supabase
    .from("employees")
    .select("employee_code")
    .in("employee_code", employeeCodes);

  if (error) {
    throw new Error(`Failed to check employee codes: ${error.message}`);
  }

  return data || [];
}

export {
  getEmployees,
  getEmployeeById,
};