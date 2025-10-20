"use server";

import { createServiceRoleClient } from "@/services/supabase/service-role-client";
import { revalidatePath } from "next/cache";

import { parseCSVOnServer, parseXLSXOnServer } from "@/utils/employees/file-parser";
import {
  validateParsedData,
  validateAgainstDatabase,
  mergeValidationResults,
  type EmployeeImportData,
  type ValidationResult,
} from "@/utils/employees/employee-validation";
import { createSVClient } from "@/services";
import { Database } from "@/types/supabase.types";

export type { EmployeeImportData, ValidationResult };

export interface ImportResult {
  successCount: number;
  failedCount: number;
  errors: Array<{
    row: number;
    employeeCode: string;
    error: string;
  }>;
}

export interface CreateEmployeePayload {
  // Personal Information
  email: string;
  full_name: string;
  phone_number?: string;
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

export async function createEmployeeAction(payload: CreateEmployeePayload) {
  console.log("Create payload received:", {
    email: payload.email,
    full_name: payload.full_name,
    department: payload.department,
    branch: payload.branch,
  });

  // Track created resources for rollback
  let userId: string | null = null;
  let employeeId: string | null = null;
  let profileId: string | null = null;

  try {
    const userSupabase = await createSVClient();

    const { data: { session }, error: sessionError } = await userSupabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
    }

    console.log("User authenticated:", session.user.email);

    const adminSupabase = createServiceRoleClient();

    const temporaryPassword = "123123123aA"; // TODO: Generate secure random password

    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email: payload.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: payload.full_name,
        phone_number: payload.phone_number || "",
        gender: payload.gender,
        birthday: payload.birthday || null,
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      throw new Error(`Lỗi tạo tài khoản: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error("Không thể tạo người dùng");
    }

    userId = authData.user.id;
    console.log(`Auth user created successfully: ${userId}`);

    try {
      let employeeCode = payload.employee_code;
      let employeeOrder: number;

      if (!employeeCode || employeeCode.trim() === "") {
        // Get the last employee order
        const { data: lastEmployee, error: orderError } = await userSupabase
          .from("employees")
          .select("employee_order")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (orderError && orderError.code !== "PGRST116") {
          // PGRST116 = no rows returned (empty table)
          throw new Error(`Failed to get last employee order: ${orderError.message}`);
        }

        const lastOrder = lastEmployee?.employee_order ?? 0;
        employeeOrder = lastOrder + 1;
        employeeCode = String(employeeOrder).padStart(5, "0");
      } else {
        const { data: lastEmployee, error: orderError } = await userSupabase
          .from("employees")
          .select("employee_order")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (orderError && orderError.code !== "PGRST116") {
          throw new Error(`Failed to get last employee order: ${orderError.message}`);
        }

        employeeOrder = (lastEmployee?.employee_order ?? 0) + 1;
      }

      const { data: employeeData, error: employeeError } = await userSupabase
        .from("employees")
        .insert({
          user_id: userId,
          employee_code: employeeCode,
          employee_order: employeeOrder,
          start_date: payload.start_date,
          position_id: payload.position_id || null,
          status: "active",
        })
        .select()
        .single();

      if (employeeError) {
        console.error("Employee creation error:", employeeError);
        throw new Error(`Lỗi tạo hồ sơ nhân viên: ${employeeError.message}`);
      }

      employeeId = employeeData.id;
      console.log(`Employee record created: ${employeeId}`);

      const { data: profileData, error: profileError } = await userSupabase
        .from("profiles")
        .insert({
          employee_id: employeeId,
          email: payload.email,
          full_name: payload.full_name,
          phone_number: payload.phone_number || "",
          gender: payload.gender,
          birthday: payload.birthday || null,
        })
        .select()
        .single();

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error(`Lỗi tạo thông tin cá nhân: ${profileError.message}`);
      }

      profileId = profileData.id;
      console.log(`Profile record created: ${profileId}`);

      const employmentsToCreate = [];

      if (payload.department) {
        employmentsToCreate.push({
          employee_id: employeeId,
          organization_unit_id: payload.department,
        });
      }

      if (payload.branch && payload.branch !== payload.department) {
        employmentsToCreate.push({
          employee_id: employeeId,
          organization_unit_id: payload.branch,
        });
      }

      if (employmentsToCreate.length > 0) {
        const { error: employmentsError } = await userSupabase
          .from("employments")
          .insert(employmentsToCreate);

        if (employmentsError) {
          console.error("Employments creation error:", employmentsError);
          throw new Error(`Lỗi tạo thông tin công việc: ${employmentsError.message}`);
        }

        console.log(`Created ${employmentsToCreate.length} employment record(s)`);
      }

      if (payload.manager_id) {
        const { error: managerError } = await userSupabase
          .from("managers_employees")
          .insert({
            employee_id: employeeId,
            manager_id: payload.manager_id,
          });

        if (managerError) {
          console.error("Manager relationship creation error:", managerError);
          throw new Error(`Lỗi tạo quan hệ quản lý: ${managerError.message}`);
        }

        console.log("Manager relationship created");
      }

      revalidatePath("/employees");

      return {
        success: true,
        message: "Tạo nhân viên thành công",
        userId,
        employeeId,
        employeeCode,
      };

    } catch (innerError) {
      console.error("Error during employee creation, initiating rollback...");
      console.error("Inner error:", innerError);

      // Delete in reverse order of creation
      if (profileId) {
        console.log(`Rolling back: Deleting profile ${profileId}`);
        await userSupabase.from("profiles").delete().eq("id", profileId);
      }

      if (employeeId) {
        console.log(`Rolling back: Deleting employments for employee ${employeeId}`);
        await userSupabase.from("employments").delete().eq("employee_id", employeeId);

        console.log(`Rolling back: Deleting manager relationships for employee ${employeeId}`);
        await userSupabase.from("managers_employees").delete().eq("employee_id", employeeId);

        console.log(`Rolling back: Deleting employee ${employeeId}`);
        await userSupabase.from("employees").delete().eq("id", employeeId);
      }

      // Delete auth user (use admin client)
      if (userId) {
        console.log(`Rolling back: Deleting auth user ${userId}`);
        await adminSupabase.auth.admin.deleteUser(userId);
      }

      console.log("Rollback completed");

      // Re-throw the error
      throw innerError;
    }
  } catch (error) {
    console.error("Error:", error);

    throw error instanceof Error
      ? error
      : new Error("Có lỗi xảy ra khi tạo nhân viên");
  }
}

export async function deleteEmployeeAction(employeeId: string) {
  if (!employeeId || typeof employeeId !== "string") {
    throw new Error("Invalid employee ID");
  }

  const supabase = createServiceRoleClient();

  try {
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

    const { error: employmentsError } = await supabase
      .from("employments")
      .delete()
      .eq("employee_id", employeeId);

    if (employmentsError) {
      throw new Error(`Failed to delete employments: ${employmentsError.message}`);
    }

    const { error: profilesError } = await supabase
      .from("profiles")
      .delete()
      .eq("employee_id", employeeId);

    if (profilesError) {
      throw new Error(`Failed to delete profile: ${profilesError.message}`);
    }

    const { error: employeeError } = await supabase
      .from("employees")
      .delete()
      .eq("id", employeeId);

    if (employeeError) {
      throw new Error(`Failed to delete employee: ${employeeError.message}`);
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error(`Warning: Failed to delete auth user: ${authError.message}`);
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

    const formatValidation = validateParsedData(parsedData);

    console.log("Format validation result:", {
      totalCount: formatValidation.totalCount,
      validCount: formatValidation.validCount,
      invalidCount: formatValidation.invalidCount,
    });

    console.log("=== DATABASE VALIDATION START ===");
    const databaseValidation = await validateAgainstDatabase(formatValidation.validRecords);
    console.log("Database validation result:", {
      invalidCount: databaseValidation.invalidRecords.length,
    });
    console.log("=== DATABASE VALIDATION END ===");

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

export async function importEmployeesFile(
  formData: FormData,
): Promise<ImportResult> {
  const supabase = createServiceRoleClient();

  try {
    const validationResult = await validateEmployeeFile(formData);

    console.log("Validation result:", {
      totalCount: validationResult.totalCount,
      validCount: validationResult.validCount,
      invalidCount: validationResult.invalidCount,
    });

    if (validationResult.validCount === 0) {
      console.log("No valid records to import");
      return {
        successCount: 0,
        failedCount: 0,
        errors: [],
      };
    }

    if (validationResult.invalidCount > 0) {
      throw new Error(
        `File chứa ${validationResult.invalidCount} bản ghi không hợp lệ. Vui lòng sửa lỗi trước khi import.`,
      );
    }

    const records = validationResult.validRecords;
    let successCount = 0;
    let failedCount = 0;
    const errors: Array<{ row: number; employeeCode: string; error: string }> = [];

    console.log(`Starting import of ${records.length} valid records...`);

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNumber = i + 2; // +2 because index is 0-based and row 1 is header

      if (!record) {
        console.log(`Skipping empty record at row ${rowNumber}`);
        continue;
      }

      try {
        // Create auth user - the database trigger will handle the rest
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: record.email,
          password: "123123123aA",
          email_confirm: true,
          user_metadata: {
            full_name: record.full_name,
            phone_number: record.phone_number || "",
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
