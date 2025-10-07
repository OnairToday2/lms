"use client";
import * as React from "react";
import PageContainer from "@/shared/ui/PageContainer";
import EmployeeForm from "@/modules/employees/components/EmployeeForm";
import type { EmployeeFormData } from "@/modules/employees/components/EmployeeForm";
import { Box } from "@mui/material";

const CreateEmployeePage = () => {
  const pageTitle = "Tạo nhân viên";
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API integration
      console.log("Form data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Show success notification
      // TODO: Navigate to employees list or employee detail page
    } catch (error) {
      console.error("Error creating employee:", error);
      // TODO: Show error notification
    } finally {
      setIsSubmitting(false);
    }
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
          isSubmitting={isSubmitting}
        />
      </Box>
    </PageContainer>
  );
};

export default CreateEmployeePage;
