import { createServiceRoleClient } from "@/services/supabase/service-role-client";
import type { Database } from "@/types/supabase.types";
import { EmployeeFormSchema } from "@/modules/employees/components/EmployeeForm/schema";

export interface EmployeeImportData {
  employee_code: string;
  full_name: string;
  email: string;
  phone_number?: string;
  gender: Database["public"]["Enums"]["gender"];
  birthday?: string;
  department: string;
  department_name?: string;
  branch?: string;
  branch_name?: string;
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

const EmployeeImportSchema = EmployeeFormSchema.partial({
  manager_id: true,
  role: true,
  position_id: true,
  employee_code: true,
  branch: true,
  phone_number: true,
  birthday: true,
  start_date: true,
}).required({
  email: true,
  full_name: true,
  gender: true,
  department: true,
});

export function validateParsedData(data: any[]): ValidationResult {
  const validRecords: EmployeeImportData[] = [];
  const invalidRecords: Array<{ row: number; data: any; errors: string[]; fieldErrors: Record<string, string> }> = [];

  // Track employee codes to check for duplicates within the file
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

    // Prepare data for Zod validation
    const recordToValidate = {
      email: row.email,
      full_name: row.full_name,
      phone_number: row.phone_number,
      gender: row.gender ? String(row.gender).toLowerCase() : undefined,
      birthday: row.birthday || null,
      branch: row.branch,
      department: row.department,
      employee_code: row.employee_code,
      start_date: row.start_date,
      // These fields are not required for import but needed for schema
      manager_id: undefined,
      role: undefined,
      position_id: undefined,
    };

    // Validate using Zod schema
    const validationResult = EmployeeImportSchema.safeParse(recordToValidate);

    if (!validationResult.success) {

      // Extract Zod validation errors
      const zodErrors = validationResult.error.issues;

      zodErrors.forEach((error) => {
        const field = error.path.join(".");
        const message = error.message;

        // Map field names to Vietnamese error messages if needed
        fieldErrors[field] = message;
        errors.push(`${field}: ${message}`);
      });

      if (index < 3) {
        console.log(`Row ${rowNumber}: Zod validation FAILED -`, errors);
        console.log(`Row ${rowNumber}: Field Errors:`, fieldErrors);
      }
    }

    // Check for duplicate employee codes within the file
    if (row.employee_code) {
      const code = String(row.employee_code).trim();
      if (employeeCodes.has(code)) {
        const errorMsg = `Mã nhân viên trùng lặp: ${code}`;
        errors.push(errorMsg);
        fieldErrors["employee_code"] = errorMsg;
      } else {
        employeeCodes.add(code);
      }
    }

    if (errors.length > 0) {
      invalidRecords.push({ row: rowNumber, data: row, errors, fieldErrors });
      if (index < 3) {
        console.log(`Row ${rowNumber}: INVALID - Errors:`, errors);
        console.log(`Row ${rowNumber}: Field Errors:`, fieldErrors);
      }
    } else {
      const validRecord: EmployeeImportData = {
        employee_code: row.employee_code ? String(row.employee_code).trim() : "",
        full_name: String(row.full_name).trim(),
        email: String(row.email).trim().toLowerCase(),
        phone_number: row.phone_number ? String(row.phone_number).trim() : undefined,
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

export async function validateAgainstDatabase(
  validRecords: EmployeeImportData[],
): Promise<{
  invalidRecords: Array<{ row: number; data: any; errors: string[]; fieldErrors: Record<string, string> }>
}> {
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

    const { data: existingEmployees, error: employeesError } = await supabase
      .from("employees")
      .select("employee_code")
      .in("employee_code", employeeCodes);

    if (employeesError) {
      console.error("Error checking employee codes:", employeesError);
      throw new Error(`Lỗi kiểm tra mã nhân viên: ${employeesError.message}`);
    }

    const existingEmployeeCodes = new Set(
      existingEmployees?.map(e => e.employee_code) || [],
    );
    console.log("Existing employee codes found:", existingEmployeeCodes.size);

    const { data: existingProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("email")
      .in("email", emails);

    if (profilesError) {
      console.error("Error checking emails:", profilesError);
      throw new Error(`Lỗi kiểm tra email: ${profilesError.message}`);
    }

    const existingEmails = new Set(
      existingProfiles?.map(p => p.email) || [],
    );
    console.log("Existing emails found:", existingEmails.size);

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
        fieldErrors["employee_code"] = errorMsg;
      }

      // Check email
      if (existingEmails.has(record.email)) {
        const errorMsg = `Email đã được sử dụng: ${record.email}`;
        errors.push(errorMsg);
        fieldErrors["email"] = errorMsg;
      }

      // Check department (optional - only if we have org units data)
      if (existingOrgUnits.size > 0 && record.department) {
        if (!existingOrgUnits.has(record.department)) {
          const errorMsg = `Phòng ban không tồn tại: ${record.department}`;
          errors.push(errorMsg);
          fieldErrors["department"] = errorMsg;
        }
      }

      // Check branch (optional - only if we have org units data)
      if (existingOrgUnits.size > 0 && record.branch) {
        if (!existingOrgUnits.has(record.branch)) {
          const errorMsg = `Chi nhánh không tồn tại: ${record.branch}`;
          errors.push(errorMsg);
          fieldErrors["branch"] = errorMsg;
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
    console.warn("Skipping database validation due to error");
    return { invalidRecords: [] };
  }
}

export function mergeValidationResults(
  formatValidation: ValidationResult,
  databaseValidation: {
    invalidRecords: Array<{ row: number; data: any; errors: string[]; fieldErrors: Record<string, string> }>
  },
): ValidationResult {
  // Start with format validation results
  const allInvalidRecords = [...formatValidation.invalidRecords];

  // Add database validation errors
  databaseValidation.invalidRecords.forEach(dbInvalid => {
    allInvalidRecords.push(dbInvalid);
  });

  // Remove records that failed database validation from valid records
  const dbInvalidRowNumbers = new Set(
    databaseValidation.invalidRecords.map(r => r.row),
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

