import type {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  GetEmployeesParams,
  EmployeeDto,
} from "@/types/dto/employees";
import type { PaginatedResult } from "@/types/dto/pagination.dto";
import {
  employeesRepository,
  profilesRepository,
  employmentsRepository,
  managersEmployeesRepository,
} from "@/repository";
import { createServiceRoleClient } from "@/services/supabase/service-role-client";

interface CreateEmployeeResult {
  userId: string;
  employeeId: string;
  employeeCode: string;
  profileId: string;
}

async function createEmployeeWithRelations(
  payload: CreateEmployeeDto
): Promise<CreateEmployeeResult> {
  let userId: string | null = null;
  let employeeId: string | null = null;
  let profileId: string | null = null;

  try {
    const adminSupabase = createServiceRoleClient();

    const temporaryPassword = "123123123aA";

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

    if (authError || !authData.user) {
      throw new Error(`Failed to create auth user: ${authError?.message || "Unknown error"}`);
    }

    userId = authData.user.id;
    console.log(`Auth user created: ${userId}`);

    let employeeCode = payload.employee_code;
    let employeeOrder: number;

    const lastOrder = await employeesRepository.getLastEmployeeOrder();

    if (!employeeCode || employeeCode.trim() === "") {
      employeeOrder = lastOrder + 1;
      employeeCode = String(employeeOrder).padStart(5, "0");
    } else {
      employeeOrder = lastOrder + 1;
    }

    const employeeData = await employeesRepository.createEmployee({
      user_id: userId,
      employee_code: employeeCode,
      employee_order: employeeOrder,
      start_date: payload.start_date,
      position_id: payload.position_id || null,
      status: "active",
    });

    employeeId = employeeData.id;
    console.log(`Employee record created: ${employeeId}`);

    const profileData = await profilesRepository.createProfile({
      employee_id: employeeId,
      email: payload.email,
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      gender: payload.gender,
      birthday: payload.birthday,
    });

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
      await employmentsRepository.createEmployments(employmentsToCreate);
      console.log(`Created ${employmentsToCreate.length} employment record(s)`);
    }

    if (payload.manager_id) {
      await managersEmployeesRepository.createManagerRelationship({
        employee_id: employeeId,
        manager_id: payload.manager_id,
      });
      console.log("Manager relationship created");
    }

    return {
      userId,
      employeeId,
      employeeCode,
      profileId,
    };
  } catch (error) {
    console.error("Error during employee creation, initiating rollback...");
    console.error("Service layer error:", error);

    if (profileId && employeeId) {
      console.log(`Rolling back: Deleting profile ${profileId}`);
      await profilesRepository.deleteProfileByEmployeeId(employeeId);
    }

    if (employeeId) {
      console.log(`Rolling back: Deleting employments for employee ${employeeId}`);
      await employmentsRepository.deleteEmploymentsByEmployeeId(employeeId);

      console.log(`Rolling back: Deleting manager relationships for employee ${employeeId}`);
      await managersEmployeesRepository.deleteManagerRelationshipsByEmployeeId(employeeId);

      console.log(`Rolling back: Deleting employee ${employeeId}`);
      await employeesRepository.deleteEmployeeById(employeeId);
    }

    if (userId) {
      console.log(`Rolling back: Deleting auth user ${userId}`);
      const adminSupabase = createServiceRoleClient();
      await adminSupabase.auth.admin.deleteUser(userId);
    }

    console.log("Rollback completed (service layer)");

    throw error;
  }
}

async function updateEmployeeWithRelations(
  payload: UpdateEmployeeDto
): Promise<void> {
  await employeesRepository.updateEmployeeById(payload.id, {
    employee_code: payload.employee_code,
    start_date: payload.start_date,
    position_id: payload.position_id || null,
  });

  await profilesRepository.updateProfileByEmployeeId(payload.id, {
    full_name: payload.full_name,
    email: payload.email,
    phone_number: payload.phone_number || "",
    gender: payload.gender,
    birthday: payload.birthday || null,
  });

  await employmentsRepository.deleteEmploymentsByEmployeeId(payload.id);

  const employmentsToCreate = [];

  if (payload.department) {
    employmentsToCreate.push({
      employee_id: payload.id,
      organization_unit_id: payload.department,
    });
  }

  if (payload.branch && payload.branch !== payload.department) {
    employmentsToCreate.push({
      employee_id: payload.id,
      organization_unit_id: payload.branch,
    });
  }

  if (employmentsToCreate.length > 0) {
    await employmentsRepository.createEmployments(employmentsToCreate);
  }

  await managersEmployeesRepository.deleteManagerRelationshipsByEmployeeId(payload.id);

  if (payload.manager_id) {
    await managersEmployeesRepository.createManagerRelationship({
      employee_id: payload.id,
      manager_id: payload.manager_id,
    });
  }
}

async function deleteEmployeeWithRelations(
  employeeId: string
): Promise<void> {
  const userId = await employeesRepository.getEmployeeUserId(employeeId);

  await employmentsRepository.deleteEmploymentsByEmployeeId(employeeId);
  await profilesRepository.deleteProfileByEmployeeId(employeeId);
  await employeesRepository.deleteEmployeeById(employeeId);

  const adminSupabase = createServiceRoleClient();
  const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId);

  if (authError) {
    console.error(`Warning: Failed to delete auth user: ${authError.message}`);
  }
}

async function getEmployees(params?: GetEmployeesParams): Promise<PaginatedResult<EmployeeDto>> {
  return employeesRepository.getEmployees(params);
}

async function getEmployeeById(id: string): Promise<EmployeeDto> {
  return employeesRepository.getEmployeeById(id);
}

export {
  createEmployeeWithRelations,
  updateEmployeeWithRelations,
  deleteEmployeeWithRelations,
  getEmployees,
  getEmployeeById,
};
