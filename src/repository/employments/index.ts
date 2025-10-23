import { supabase } from "@/services";
import { createSVClient } from "@/services";

const getEmployments = async () => {
  const response = await supabase
    .from("employments")
    .select("*, employees(*, profiles(*))");

  return response.data;
};

export async function createEmployments(
  employments: Array<{
    employee_id: string;
    organization_unit_id: string;
  }>
) {
  const supabase = await createSVClient();

  const { error } = await supabase
    .from("employments")
    .insert(employments);

  if (error) {
    throw new Error(`Failed to create employments: ${error.message}`);
  }
}

export async function deleteEmploymentsByEmployeeId(employeeId: string) {
  const supabase = await createSVClient();

  const { error } = await supabase
    .from("employments")
    .delete()
    .eq("employee_id", employeeId);

  if (error) {
    throw new Error(`Failed to delete employments: ${error.message}`);
  }
}

export {
  getEmployments,
};

