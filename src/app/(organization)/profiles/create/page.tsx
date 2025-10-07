"use client";
import * as React from "react";
import PageContainer from "@/shared/ui/PageContainer";

const CreateProfilePage = () => {
  const pageTitle = "Profiles";

  return (
    <PageContainer title={pageTitle} breadcrumbs={[{ title: pageTitle }]}>
      <p>{pageTitle}</p>
    </PageContainer>
  );
};
export default CreateProfilePage;
