import { supabase } from "@/services";
import { EmployeeStudentWithProfileItem } from "@/model/employee.model";
export type EmployeeQueryParams = {
  page?: number;
  pageSize?: number;
  excludes?: string[];
  search?: string;
};

const getStudents = async (queryParams?: EmployeeQueryParams) => {
  const { page = 1, pageSize = 20, excludes, search } = queryParams || {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let studentQuery = supabase
    .from("employees")
    .select(
      `id, 
      employee_code, 
      status, 
      created_at, 
      employee_type,
      profiles!inner(
        id, 
        full_name, 
        gender, 
        avatar, 
        email,
        avatar
      ),
      employments(
        organization_units(
          id,
          name, 
          type
        )
      )
    `,
      {
        count: "exact",
      },
    )
    .eq("employee_type", "student");

  const excludeStr = excludes ? excludes.join(",") : "";

  if (excludeStr) {
    studentQuery = studentQuery.not("id", "in", `(${excludeStr})`);
  }
  if (search) {
    studentQuery = studentQuery.ilike("profiles.full_name", `%${search}%`);
  }

  const { data, error, count, status, statusText } = await studentQuery
    .order("created_at", { ascending: false })
    .range(from, to);

  return {
    data: data as EmployeeStudentWithProfileItem[],
    count,
    error,
    status,
    statusText,
  };
};

export { getStudents };
