/**
 * Employee Validation Utilities
 * 
 * This module provides validation logic for employee import functionality,
 * including format validation and database validation.
 */

import { createServiceRoleClient } from "@/services/supabase/service-role-client";
import type { Database } from "@/types/supabase.types";

// Re-export types that are used by validation functions
export interface EmployeeImportData {
  employee_code: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  gender: Database["public"]["Enums"]["gender"];
  birthday?: string;
  department: string;
  branch?: string;
  start_date?: string;
}

export interface ValidationResult {
  totalCount: number;
  validCount: number;
  invalidCount: number;
  validRecords: EmployeeImportData[];
  invalidRecords: Array<{
    row: number;
    data: any;
    errors: string[];
    fieldErrors: Record<string, string>;
  }>;
}

/**
 * Validate parsed employee data for format and required fields
 * This is the first step of validation (format validation)
 *
 * @param data - Array of employee records to validate
 * @returns Validation result with valid and invalid records
 */
export function validateParsedData(data: any[]): ValidationResult {
  const validRecords: EmployeeImportData[] = [];
  const invalidRecords: Array<{ row: number; data: any; errors: string[]; fieldErrors: Record<string, string> }> = [];

  // Track employee codes to check for duplicates
  const employeeCodes = new Set<string>();

  console.log("=== VALIDATE PARSED DATA START ===");
  console.log("Total rows to validate:", data.length);

  data.forEach((row, index) => {
    const errors: string[] = [];
    const fieldErrors: Record<string, string> = {};
    const rowNumber = index + 2; // +2 because index is 0-based and row 1 is header

    // Debug first few rows
    if (index < 3) {
      console.log(`Row ${rowNumber} data:`, row);
      console.log(`Row ${rowNumber} keys:`, Object.keys(row));
    }

    // Validate required fields
    if (!row.employee_code || String(row.employee_code).trim() === "") {
      const errorMsg = "Thiếu mã nhân viên";
      errors.push(errorMsg);
      fieldErrors['employee_code'] = errorMsg;
      if (index < 3) console.log(`Row ${rowNumber}: Missing employee_code`);
    }
    if (!row.fullName || String(row.fullName).trim() === "") {
      const errorMsg = "Thiếu họ tên";
      errors.push(errorMsg);
      fieldErrors['fullName'] = errorMsg;
      if (index < 3) console.log(`Row ${rowNumber}: Missing fullName`);
    }
    if (!row.email || String(row.email).trim() === "") {
      const errorMsg = "Thiếu email";
      errors.push(errorMsg);
      fieldErrors['email'] = errorMsg;
      if (index < 3) console.log(`Row ${rowNumber}: Missing email`);
    }
    if (!row.department || String(row.department).trim() === "") {
      const errorMsg = "Thiếu phòng ban";
      errors.push(errorMsg);
      fieldErrors['department'] = errorMsg;
      if (index < 3) console.log(`Row ${rowNumber}: Missing department`);
    }

    // Validate email format
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.email))) {
      const errorMsg = "Email không hợp lệ";
      errors.push(errorMsg);
      fieldErrors['email'] = errorMsg;
    }

    // Check for duplicate employee codes within the file
    if (row.employee_code) {
      const code = String(row.employee_code).trim();
      if (employeeCodes.has(code)) {
        const errorMsg = `Mã nhân viên trùng lặp: ${code}`;
        errors.push(errorMsg);
        fieldErrors['employee_code'] = errorMsg;
      } else {
        employeeCodes.add(code);
      }
    }

    // Validate gender if provided
    if (row.gender) {
      const validGenders = ["male", "female", "other"];
      if (!validGenders.includes(String(row.gender).toLowerCase())) {
        const errorMsg = "Giới tính không hợp lệ (phải là: male, female, hoặc other)";
        errors.push(errorMsg);
        fieldErrors['gender'] = errorMsg;
      }
    }

    // Validate date formats
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (row.birthday && !dateRegex.test(String(row.birthday))) {
      const errorMsg = "Ngày sinh không đúng định dạng (YYYY-MM-DD)";
      errors.push(errorMsg);
      fieldErrors['birthday'] = errorMsg;
    }
    if (row.start_date && !dateRegex.test(String(row.start_date))) {
      const errorMsg = "Ngày bắt đầu không đúng định dạng (YYYY-MM-DD)";
      errors.push(errorMsg);
      fieldErrors['start_date'] = errorMsg;
    }

    if (errors.length > 0) {
      invalidRecords.push({ row: rowNumber, data: row, errors, fieldErrors });
      if (index < 3) {
        console.log(`Row ${rowNumber}: INVALID - Errors:`, errors);
        console.log(`Row ${rowNumber}: Field Errors:`, fieldErrors);
      }
    } else {
      // Normalize the data
      const validRecord: EmployeeImportData = {
        employee_code: String(row.employee_code).trim(),
        fullName: String(row.fullName).trim(),
        email: String(row.email).trim().toLowerCase(),
        phoneNumber: row.phoneNumber ? String(row.phoneNumber).trim() : undefined,
        gender: (row.gender ? String(row.gender).toLowerCase() : "male") as Database["public"]["Enums"]["gender"],
        birthday: row.birthday ? String(row.birthday).trim() : undefined,
        department: String(row.department).trim(),
        branch: row.branch ? String(row.branch).trim() : undefined,
        start_date: row.start_date ? String(row.start_date).trim() : undefined,
      };
      validRecords.push(validRecord);
      if (index < 3) {
        console.log(`Row ${rowNumber}: VALID`);
      }
    }
  });

  console.log("=== VALIDATE PARSED DATA END ===");
  console.log("Summary:", {
    total: data.length,
    valid: validRecords.length,
    invalid: invalidRecords.length,
  });

  return {
    totalCount: data.length,
    validCount: validRecords.length,
    invalidCount: invalidRecords.length,
    validRecords,
    invalidRecords,
  };
}

/**
 * Validate employee data against the database
 * Checks for existing employee codes, emails, and organization units
 * This is the second step of validation (database validation)
 *
 * @param validRecords - Records that passed format validation
 * @returns Validation result with database conflicts
 */
export async function validateAgainstDatabase(
  validRecords: EmployeeImportData[]
): Promise<{ invalidRecords: Array<{ row: number; data: any; errors: string[]; fieldErrors: Record<string, string> }> }> {
  const invalidRecords: Array<{ row: number; data: any; errors: string[]; fieldErrors: Record<string, string> }> = [];

  if (validRecords.length === 0) {
    return { invalidRecords };
  }

  const supabase = createServiceRoleClient();

  try {
    // Collect all employee codes and emails from the file
    const employeeCodes = validRecords.map(r => r.employee_code);
    const emails = validRecords.map(r => r.email);
    const departments = [...new Set(validRecords.map(r => r.department).filter(Boolean))];
    const branches = [...new Set(validRecords.map(r => r.branch).filter(Boolean))];

    console.log("Checking database for:", {
      employeeCodes: employeeCodes.length,
      emails: emails.length,
      departments: departments.length,
      branches: branches.length,
    });

    // Query 1: Check for existing employee codes
    const { data: existingEmployees, error: employeesError } = await supabase
      .from("employees")
      .select("employee_code")
      .in("employee_code", employeeCodes);

    if (employeesError) {
      console.error("Error checking employee codes:", employeesError);
      throw new Error(`Lỗi kiểm tra mã nhân viên: ${employeesError.message}`);
    }

    const existingEmployeeCodes = new Set(
      existingEmployees?.map(e => e.employee_code) || []
    );
    console.log("Existing employee codes found:", existingEmployeeCodes.size);

    // Query 2: Check for existing emails in profiles table
    const { data: existingProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("email")
      .in("email", emails);

    if (profilesError) {
      console.error("Error checking emails:", profilesError);
      throw new Error(`Lỗi kiểm tra email: ${profilesError.message}`);
    }

    const existingEmails = new Set(
      existingProfiles?.map(p => p.email) || []
    );
    console.log("Existing emails found:", existingEmails.size);

    // Query 3: Check for existing organization units (departments and branches)
    const allOrgUnits = [...departments, ...branches];
    let existingOrgUnits = new Set<string>();

    if (allOrgUnits.length > 0) {
      const { data: orgUnits, error: orgUnitsError } = await supabase
        .from("organization_units")
        .select("id, name, type");

      if (orgUnitsError) {
        console.error("Error checking organization units:", orgUnitsError);
        // Don't throw error for org units - make it optional
        console.warn("Skipping organization unit validation due to error");
      } else {
        existingOrgUnits = new Set(orgUnits?.map(u => u.id) || []);
        console.log("Existing organization units found:", existingOrgUnits.size);
      }
    }

    // Validate each record against database
    validRecords.forEach((record, index) => {
      const errors: string[] = [];
      const fieldErrors: Record<string, string> = {};
      const rowNumber = index + 2; // +2 because index is 0-based and row 1 is header

      // Check employee code
      if (existingEmployeeCodes.has(record.employee_code)) {
        const errorMsg = `Mã nhân viên đã tồn tại trong hệ thống: ${record.employee_code}`;
        errors.push(errorMsg);
        fieldErrors['employee_code'] = errorMsg;
      }

      // Check email
      if (existingEmails.has(record.email)) {
        const errorMsg = `Email đã được sử dụng: ${record.email}`;
        errors.push(errorMsg);
        fieldErrors['email'] = errorMsg;
      }

      // Check department (optional - only if we have org units data)
      if (existingOrgUnits.size > 0 && record.department) {
        if (!existingOrgUnits.has(record.department)) {
          const errorMsg = `Phòng ban không tồn tại: ${record.department}`;
          errors.push(errorMsg);
          fieldErrors['department'] = errorMsg;
        }
      }

      // Check branch (optional - only if we have org units data)
      if (existingOrgUnits.size > 0 && record.branch) {
        if (!existingOrgUnits.has(record.branch)) {
          const errorMsg = `Chi nhánh không tồn tại: ${record.branch}`;
          errors.push(errorMsg);
          fieldErrors['branch'] = errorMsg;
        }
      }

      if (errors.length > 0) {
        invalidRecords.push({ row: rowNumber, data: record, errors, fieldErrors });
        if (index < 3) {
          console.log(`Row ${rowNumber}: Database validation FAILED -`, errors);
          console.log(`Row ${rowNumber}: Field Errors:`, fieldErrors);
        }
      }
    });

    console.log("Database validation complete:", {
      checked: validRecords.length,
      invalid: invalidRecords.length,
    });

    return { invalidRecords };
  } catch (error) {
    console.error("Database validation error:", error);
    // Don't fail the entire validation if database check fails
    // Return empty invalid records and log the error
    console.warn("Skipping database validation due to error");
    return { invalidRecords: [] };
  }
}

/**
 * Merge format validation and database validation results
 * This is the final step that combines both validation results
 *
 * @param formatValidation - Results from format validation
 * @param databaseValidation - Results from database validation
 * @returns Combined validation result
 */
export function mergeValidationResults(
  formatValidation: ValidationResult,
  databaseValidation: { invalidRecords: Array<{ row: number; data: any; errors: string[]; fieldErrors: Record<string, string> }> }
): ValidationResult {
  // Start with format validation results
  const allInvalidRecords = [...formatValidation.invalidRecords];

  // Add database validation errors
  databaseValidation.invalidRecords.forEach(dbInvalid => {
    allInvalidRecords.push(dbInvalid);
  });

  // Remove records that failed database validation from valid records
  const dbInvalidRowNumbers = new Set(
    databaseValidation.invalidRecords.map(r => r.row)
  );

  const finalValidRecords = formatValidation.validRecords.filter((_, index) => {
    const rowNumber = index + 2; // +2 because index is 0-based and row 1 is header
    return !dbInvalidRowNumbers.has(rowNumber);
  });

  return {
    totalCount: formatValidation.totalCount,
    validCount: finalValidRecords.length,
    invalidCount: allInvalidRecords.length,
    validRecords: finalValidRecords,
    invalidRecords: allInvalidRecords,
  };
}

