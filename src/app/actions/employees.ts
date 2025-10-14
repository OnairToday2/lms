"use server";

import { createServiceRoleClient } from "@/services/supabase/service-role-client";
import { revalidatePath } from "next/cache";

// Import utilities
import { parseCSVOnServer, parseXLSXOnServer } from "@/utils/employees/file-parser";
import {
  validateParsedData,
  validateAgainstDatabase,
  mergeValidationResults,
  type EmployeeImportData,
  type ValidationResult,
} from "@/utils/employees/employee-validation";

// Re-export types for external use
export type { EmployeeImportData, ValidationResult };

export interface FieldError {
  field: string;
  message: string;
}

export interface ImportResult {
  successCount: number;
  failedCount: number;
  errors: Array<{
    row: number;
    employeeCode: string;
    error: string;
  }>;
}

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

/**
 * Validate employee import file (server-side parsing and validation)
 * This server action accepts a raw file via FormData and handles all parsing on the server
 *
 * @param formData - FormData containing the file to validate
 * @returns Validation result with valid and invalid records
 */
export async function validateEmployeeFile(
  formData: FormData,
): Promise<ValidationResult> {
  try {
    // Extract the file from FormData
    const file = formData.get("file") as File;

    console.log("=== VALIDATE EMPLOYEE FILE START ===");
    console.log("File received:", file ? file.name : "NO FILE");

    if (!file) {
      throw new Error("Không tìm thấy file trong request");
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith(".csv");
    const isXLSX = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

    console.log("File type:", { fileName, isCSV, isXLSX });

    if (!isCSV && !isXLSX) {
      throw new Error("Định dạng file không được hỗ trợ. Vui lòng tải lên file CSV hoặc XLSX");
    }

    // Validate file size (4MB max)
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      throw new Error("File quá lớn. Kích thước tối đa là 4MB");
    }

    console.log("File size:", file.size, "bytes");

    let parsedData: any[];

    if (isCSV) {
      // Parse CSV file
      const text = await file.text();
      console.log("CSV text length:", text.length);
      console.log("CSV first 200 chars:", text.substring(0, 200));

      parsedData = parseCSVOnServer(text);
      console.log("Parsed data count:", parsedData.length);
      console.log("First parsed row:", parsedData[0]);
      console.log("Sample row keys:", parsedData[0] ? Object.keys(parsedData[0]) : "NO DATA");
    } else {
      // Parse XLSX file
      const buffer = await file.arrayBuffer();
      parsedData = await parseXLSXOnServer(buffer);
    }

    if (!parsedData || parsedData.length === 0) {
      throw new Error("File không chứa dữ liệu hoặc định dạng không đúng");
    }

    console.log("Total records to validate:", parsedData.length);

    // Step 1: Format validation
    const formatValidation = validateParsedData(parsedData);

    console.log("Format validation result:", {
      totalCount: formatValidation.totalCount,
      validCount: formatValidation.validCount,
      invalidCount: formatValidation.invalidCount,
    });

    // Step 2: Database validation (only for records that passed format validation)
    console.log("=== DATABASE VALIDATION START ===");
    const databaseValidation = await validateAgainstDatabase(formatValidation.validRecords);
    console.log("Database validation result:", {
      invalidCount: databaseValidation.invalidRecords.length,
    });
    console.log("=== DATABASE VALIDATION END ===");

    // Step 3: Merge validation results
    const finalResult = mergeValidationResults(formatValidation, databaseValidation);

    console.log("Final validation result:", {
      totalCount: finalResult.totalCount,
      validCount: finalResult.validCount,
      invalidCount: finalResult.invalidCount,
    });

    if (finalResult.invalidCount > 0) {
      console.log("Sample invalid records:", finalResult.invalidRecords.slice(0, 3));
    }

    console.log("=== VALIDATE EMPLOYEE FILE END ===");

    return finalResult;
  } catch (error) {
    console.error("Error validating employee file:", error);
    throw error instanceof Error
      ? error
      : new Error("Có lỗi xảy ra khi xác thực file");
  }
}

/**
 * Import validated employee records into the database
 * Uses the service role client and relies on the handle_new_employee trigger
 * This server action accepts FormData containing the file and validates it before importing
 *
 * @param formData - FormData containing the file to import
 * @returns Import result with success/failure counts and errors
 */
export async function importEmployeesFile(
  formData: FormData,
): Promise<ImportResult> {
  const supabase = createServiceRoleClient();

  try {
    console.log("=== IMPORT EMPLOYEES FILE START ===");

    // Step 1: Validate the file first to get valid records
    const validationResult = await validateEmployeeFile(formData);

    console.log("Validation result:", {
      totalCount: validationResult.totalCount,
      validCount: validationResult.validCount,
      invalidCount: validationResult.invalidCount,
    });

    // Step 2: Check if there are any valid records to import
    if (validationResult.validCount === 0) {
      console.log("No valid records to import");
      return {
        successCount: 0,
        failedCount: 0,
        errors: [],
      };
    }

    // Step 3: Check if there are any invalid records
    if (validationResult.invalidCount > 0) {
      throw new Error(
        `File chứa ${validationResult.invalidCount} bản ghi không hợp lệ. Vui lòng sửa lỗi trước khi import.`
      );
    }

    // Step 4: Import the valid records
    const records = validationResult.validRecords;
    let successCount = 0;
    let failedCount = 0;
    const errors: Array<{ row: number; employeeCode: string; error: string }> = [];

    console.log(`Starting import of ${records.length} valid records...`);

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNumber = i + 2; // +2 because index is 0-based and row 1 is header

      try {
        // Create auth user - the database trigger will handle the rest
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: record.email,
          password: "123123123aA",
          email_confirm: true,
          user_metadata: {
            full_name: record.fullName,
            phone_number: record.phoneNumber || "",
            gender: record.gender,
            birthday: record.birthday || null,
            employee_code: record.employee_code || "",
            start_date: record.start_date || null,
            department_id: record.department,
            branch_id: record.branch || null,
            manager_id: null,
          },
        });

        if (authError) {
          throw new Error(authError.message);
        }

        if (!authData.user) {
          throw new Error("Failed to create user");
        }

        successCount++;
        console.log(`Successfully imported employee ${record.employee_code} (${successCount}/${records.length})`);
      } catch (error) {
        failedCount++;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        errors.push({
          row: rowNumber,
          employeeCode: record.employee_code,
          error: errorMessage,
        });
        console.error(`Failed to import employee ${record.employee_code}:`, errorMessage);
      }
    }

    console.log("Import complete:", {
      successCount,
      failedCount,
      totalErrors: errors.length,
    });

    // Revalidate the employees page to refresh the list
    revalidatePath("/employees");

    console.log("=== IMPORT EMPLOYEES FILE END ===");

    return {
      successCount,
      failedCount,
      errors,
    };
  } catch (error) {
    console.error("Error importing employee file:", error);
    throw error instanceof Error
      ? error
      : new Error("Có lỗi xảy ra khi import file nhân viên");
  }
}
