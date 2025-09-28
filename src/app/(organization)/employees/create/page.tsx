"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import useNotifications from "@/hooks/useNotifications/useNotifications";
import {
  createOne as createEmployee,
  validate as validateEmployee,
  type Employee,
} from "../data/employees";
import EmployeeForm, {
  type FormFieldValue,
  type EmployeeFormState,
} from "../_components/EmployeeForm";
import PageContainer from "@/shared/ui/PageContainer";

const INITIAL_FORM_VALUES: Partial<EmployeeFormState["values"]> = {
  role: "Market",
  isFullTime: true,
};

const PageEmployeeCreate = () => {
  const navigate = useRouter();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<EmployeeFormState>(() => ({
    values: INITIAL_FORM_VALUES,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback(
    (newFormValues: Partial<EmployeeFormState["values"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    [],
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<EmployeeFormState["errors"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    [],
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof EmployeeFormState["values"], value: FormFieldValue) => {
      const validateField = async (
        values: Partial<EmployeeFormState["values"]>,
      ) => {
        const { issues } = validateEmployee(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formValues, [name]: value };

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues],
  );

  const handleFormReset = React.useCallback(() => {
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = validateEmployee(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(
          issues.map((issue) => [issue.path?.[0], issue.message]),
        ),
      );
      return;
    }
    setFormErrors({});

    try {
      await createEmployee(formValues as Omit<Employee, "id">);
      notifications.show("Employee created successfully.", {
        severity: "success",
        autoHideDuration: 3000,
      });

      navigate.push("/employees");
    } catch (createError) {
      notifications.show(
        `Failed to create employee. Reason: ${(createError as Error).message}`,
        {
          severity: "error",
          autoHideDuration: 3000,
        },
      );
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  const pageTitle = "Employees";

  return (
    <PageContainer title={pageTitle} breadcrumbs={[{ title: pageTitle }]}>
      <EmployeeForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
};
export default PageEmployeeCreate;
