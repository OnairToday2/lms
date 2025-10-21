import { supabase } from "@/services";
import { createSVClient } from "@/services";
import type { EmployeeDto, GetEmployeesParams } from "@/types/dto/employees";
import type { PaginatedResult } from "@/types/dto/pagination.dto";
import { Database } from "@/types/supabase.types";

const getEmployees = async (params?: GetEmployeesParams): Promise<PaginatedResult<EmployeeDto>> => {
  const page = params?.page ?? 0;
  const limit = params?.limit ?? 12;
  const search = params?.search?.trim();
  const departmentId = params?.departmentId;
  const branchId = params?.branchId;

  // Check if we have organization unit filters
  const hasDepartmentFilter = departmentId && departmentId !== 'all';
  const hasBranchFilter = branchId && branchId !== 'all';
  const hasOrgUnitFilter = hasDepartmentFilter || hasBranchFilter;

  // If we have organization unit filters, we need a two-step approach:
  // 1. First, get employee IDs that match the filter criteria
  // 2. Then, fetch full employee data (with ALL employments) for those IDs
  // This ensures we filter employees correctly while still returning all their employment data

  if (hasOrgUnitFilter) {
    let employeeIds: string[] = [];
    let totalCount = 0;

    if (hasDepartmentFilter && hasBranchFilter) {
      // Both filters: employee must have employments matching BOTH branch AND department
      // We need to find employees that have BOTH employments
      // Step 1a: Get all employees with the department employment
      const { data: deptEmployees, error: deptError } = await supabase
        .from("employees")
        .select("id, employments!inner(organization_unit_id)")
        .filter('employments.organization_unit_id', 'eq', departmentId);

      if (deptError) {
        throw new Error(`Failed to fetch department employees: ${deptError.message}`);
      }

      // Step 1b: Get all employees with the branch employment
      const { data: branchEmployees, error: branchError } = await supabase
        .from("employees")
        .select("id, employments!inner(organization_unit_id)")
        .filter('employments.organization_unit_id', 'eq', branchId);

      if (branchError) {
        throw new Error(`Failed to fetch branch employees: ${branchError.message}`);
      }

      // Step 1c: Find intersection - employees that appear in BOTH lists
      const deptEmployeeIds = new Set(deptEmployees?.map(emp => emp.id) || []);
      const branchEmployeeIds = new Set(branchEmployees?.map(emp => emp.id) || []);
      const intersectionIds = Array.from(deptEmployeeIds).filter(id => branchEmployeeIds.has(id));

      // Apply search filter if present
      if (search && intersectionIds.length > 0) {
        const { data: searchFiltered, error: searchError } = await supabase
          .from("employees")
          .select("id, profiles!profiles_employee_id_fkey(full_name, email)")
          .in('id', intersectionIds)
          .or(`employee_code.ilike.%${search}%,profiles.full_name.ilike.%${search}%,profiles.email.ilike.%${search}%`);

        if (searchError) {
          throw new Error(`Failed to apply search filter: ${searchError.message}`);
        }

        employeeIds = searchFiltered?.map(emp => emp.id) || [];
      } else {
        employeeIds = intersectionIds;
      }

      totalCount = employeeIds.length;

      // Apply pagination
      const from = page * limit;
      const to = from + limit;
      employeeIds = employeeIds.slice(from, to);

    } else {
      // Single filter: department only OR branch only
      let filterQuery = supabase
        .from("employees")
        .select("id, employments!inner(organization_unit_id)", { count: 'exact' });

      // Apply search filter if present
      if (search) {
        filterQuery = filterQuery.or(`employee_code.ilike.%${search}%,profiles.full_name.ilike.%${search}%,profiles.email.ilike.%${search}%`);
      }

      // Apply organization unit filter
      if (hasDepartmentFilter) {
        filterQuery = filterQuery.filter('employments.organization_unit_id', 'eq', departmentId);
      } else if (hasBranchFilter) {
        filterQuery = filterQuery.filter('employments.organization_unit_id', 'eq', branchId);
      }

      const from = page * limit;
      const to = from + limit - 1;

      const { data: filteredEmployees, error: filterError, count } = await filterQuery
        .order("created_at", { ascending: false })
        .range(from, to);

      if (filterError) {
        throw new Error(`Failed to fetch filtered employees: ${filterError.message}`);
      }

      employeeIds = filteredEmployees?.map(emp => emp.id) || [];
      totalCount = count ?? 0;
    }

    if (employeeIds.length === 0) {
      return {
        data: [],
        total: totalCount,
        page,
        limit,
      };
    }

    // Step 2: Fetch full employee data for the filtered IDs
    // Use LEFT JOIN for employments to get ALL employment records

    const { data: fullEmployeeData, error: dataError } = await supabase
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
      .in('id', employeeIds)
      .order("created_at", { ascending: false });

    if (dataError) {
      throw new Error(`Failed to fetch employee data: ${dataError.message}`);
    }

    return {
      data: (fullEmployeeData as unknown as EmployeeDto[]) || [],
      total: totalCount,
      page,
      limit,
    };
  }

  // No organization unit filters - use simple query with LEFT JOIN
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

  const from = page * limit;
  const to = from + limit - 1;

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
    limit,
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