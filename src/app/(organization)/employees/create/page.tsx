"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/shared/ui/PageContainer";
import EmployeeForm from "@/modules/employees/components/EmployeeForm";
import type { EmployeeFormData } from "@/modules/employees/components/EmployeeForm";
import { useCreateEmployeeMutation } from "@/modules/employees/operations/mutation";
import useNotifications from "@/hooks/useNotifications/useNotifications";
import { Box } from "@mui/material";
import type { CreateEmployeePayload } from "@/app/actions/employees";

const CreateEmployeePage = () => {
  const pageTitle = "Tạo nhân viên";
  const router = useRouter();
  const notifications = useNotifications();
  const { mutate: createEmployee, isPending } = useCreateEmployeeMutation();

  const handleSubmit = async (data: EmployeeFormData) => {
    // Map EmployeeFormData to CreateEmployeePayload
    const payload: CreateEmployeePayload = {
      email: data.email,
      full_name: data.full_name,
      phone_number: data.phone_number,
      gender: data.gender,
      birthday: data.birthday,
      branch: data.branch,
      department: data.department,
      employee_code: data.employee_code,
      manager_id: data.manager_id,
      role: data.role,
      position_id: data.position_id,
      start_date: data.start_date,
    };

    createEmployee(payload, {
      onSuccess: () => {
        notifications.show("Tạo nhân viên thành công!", {
          severity: "success",
          autoHideDuration: 3000,
        });

        // Navigate to employees list page
        router.push("/employees");
      },
      onError: (error) => {
        console.error("Error creating employee:", error);
        notifications.show(
          `Tạo nhân viên thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`,
          {
            severity: "error",
            autoHideDuration: 5000,
          }
        );
      },
    });
  };

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: "Nhân viên", path: "/employees" },
        { title: pageTitle },
      ]}
    >
      <Box sx={{ py: 3 }}>
        <EmployeeForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </Box>
    </PageContainer>
  );
};

export default CreateEmployeePage;
