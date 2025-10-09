"use server";

import { createServiceRoleClient } from "@/services/supabase/service-role-client";
import { revalidatePath } from "next/cache";

/**
 * Server action to delete an employee and all related records
 * This uses the service role client to bypass RLS policies
 * 
 * @param employeeId - The ID of the employee to delete
 * @returns Success message or throws an error
 */
export async function deleteEmployeeAction(employeeId: string) {
  if (!employeeId || typeof employeeId !== "string") {
    throw new Error("Invalid employee ID");
  }

  const supabase = createServiceRoleClient();

  try {
    // 1. First, get the employee record to retrieve the user_id
    const { data: employee, error: fetchError } = await supabase
      .from("employees")
      .select("user_id")
      .eq("id", employeeId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch employee: ${fetchError.message}`);
    }

    if (!employee) {
      throw new Error("Employee not found");
    }

    const userId = employee.user_id;

    // 2. Delete related records in the correct order to avoid foreign key constraints
    
    // Delete employments (references employees)
    const { error: employmentsError } = await supabase
      .from("employments")
      .delete()
      .eq("employee_id", employeeId);

    if (employmentsError) {
      throw new Error(`Failed to delete employments: ${employmentsError.message}`);
    }

    // Delete profiles (references employees)
    const { error: profilesError } = await supabase
      .from("profiles")
      .delete()
      .eq("employee_id", employeeId);

    if (profilesError) {
      throw new Error(`Failed to delete profile: ${profilesError.message}`);
    }

    // Delete employee record
    const { error: employeeError } = await supabase
      .from("employees")
      .delete()
      .eq("id", employeeId);

    if (employeeError) {
      throw new Error(`Failed to delete employee: ${employeeError.message}`);
    }

    // 3. Finally, delete the auth user
    // This should be done last to ensure we can still access the employee data if needed
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      // Log the error but don't fail the entire operation
      // The database records are already deleted
      console.error(`Warning: Failed to delete auth user: ${authError.message}`);
      // You might want to handle this differently in production
      // For now, we'll continue since the main records are deleted
    }

    // Revalidate the employees page to refresh the list
    revalidatePath("/employees");

    return {
      success: true,
      message: "Employee deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while deleting the employee");
  }
}

