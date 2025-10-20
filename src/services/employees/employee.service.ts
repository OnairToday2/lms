import type { CreateEmployeeDto, UpdateEmployeeDto } from "@/types/dto/employee.dto";
import * as employeeRepository from "@/repository/employees";
import * as profileRepository from "@/repository/profiles";
import * as employmentRepository from "@/repository/employments";
import * as managerEmployeeRepository from "@/repository/managers-employees";
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

    const lastOrder = await employeeRepository.getLastEmployeeOrder();

    if (!employeeCode || employeeCode.trim() === "") {
      employeeOrder = lastOrder + 1;
      employeeCode = String(employeeOrder).padStart(5, "0");
    } else {
      employeeOrder = lastOrder + 1;
    }

    const employeeData = await employeeRepository.createEmployee({
      user_id: userId,
      employee_code: employeeCode,
      employee_order: employeeOrder,
      start_date: payload.start_date,
      position_id: payload.position_id || null,
      status: "active",
    });

    employeeId = employeeData.id;
    console.log(`Employee record created: ${employeeId}`);

    const profileData = await profileRepository.createProfile({
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
      await employmentRepository.createEmployments(employmentsToCreate);
      console.log(`Created ${employmentsToCreate.length} employment record(s)`);
    }

    if (payload.manager_id) {
      await managerEmployeeRepository.createManagerRelationship({
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
      await profileRepository.deleteProfileByEmployeeId(employeeId);
    }

    if (employeeId) {
      console.log(`Rolling back: Deleting employments for employee ${employeeId}`);
      await employmentRepository.deleteEmploymentsByEmployeeId(employeeId);

      console.log(`Rolling back: Deleting manager relationships for employee ${employeeId}`);
      await managerEmployeeRepository.deleteManagerRelationshipsByEmployeeId(employeeId);

      console.log(`Rolling back: Deleting employee ${employeeId}`);
      await employeeRepository.deleteEmployeeById(employeeId);
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
  await employeeRepository.updateEmployeeById(payload.id, {
    employee_code: payload.employee_code,
    start_date: payload.start_date,
    position_id: payload.position_id || null,
  });

  await profileRepository.updateProfileByEmployeeId(payload.id, {
    full_name: payload.full_name,
    email: payload.email,
    phone_number: payload.phone_number || "",
    gender: payload.gender,
    birthday: payload.birthday || null,
  });

  await employmentRepository.deleteEmploymentsByEmployeeId(payload.id);

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
    await employmentRepository.createEmployments(employmentsToCreate);
  }

  await managerEmployeeRepository.deleteManagerRelationshipsByEmployeeId(payload.id);

  if (payload.manager_id) {
    await managerEmployeeRepository.createManagerRelationship({
      employee_id: payload.id,
      manager_id: payload.manager_id,
    });
  }
}

async function deleteEmployeeWithRelations(
  employeeId: string
): Promise<void> {
  const userId = await employeeRepository.getEmployeeUserId(employeeId);

  await employmentRepository.deleteEmploymentsByEmployeeId(employeeId);
  await profileRepository.deleteProfileByEmployeeId(employeeId);
  await employeeRepository.deleteEmployeeById(employeeId);

  const adminSupabase = createServiceRoleClient();
  const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId);

  if (authError) {
    console.error(`Warning: Failed to delete auth user: ${authError.message}`);
  }
}

export {
  createEmployeeWithRelations,
  updateEmployeeWithRelations,
  deleteEmployeeWithRelations,
};
