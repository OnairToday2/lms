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
import SelectTextFields from "../_components/Selects";
import ButtonsIcons from "../_components/ButtonsIcon";
import InputFields from "../_components/InputFields";
import Buttons from "../_components/Buttons";
import InputAdornments from "../_components/InputAdorment";
import { Divider } from "@mui/material";
import InputWithIcon from "../_components/InputIcons";
import ComposedTextField from "../_components/ComposeTextFields";
import ColorCheckboxes from "../_components/Checkboxes";

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
      <SelectTextFields />
      <Divider className="my-12">Button Icon</Divider>
      <ButtonsIcons />
      <Divider className="my-12">Buttons</Divider>
      <Buttons />
      <Divider className="my-12">Input</Divider>
      <InputFields />
      <Divider className="my-12">Input Adorment</Divider>
      <InputAdornments />
      <Divider className="my-12">Input with icon</Divider>
      <InputWithIcon />
      <Divider className="my-12">Composed text fields</Divider>
      <ComposedTextField />
      <Divider className="my-12">Checkboxes</Divider>

      <ColorCheckboxes />
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
