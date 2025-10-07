"use client";
import * as React from "react";
import PageContainer from "@/shared/ui/PageContainer";

const CreateEmployeePage = () => {
  const pageTitle = "Employees";

  return (
    <PageContainer title={pageTitle} breadcrumbs={[{ title: pageTitle }]}>
      <p>{pageTitle}</p>
    </PageContainer>
  );
};
export default CreateEmployeePage;
