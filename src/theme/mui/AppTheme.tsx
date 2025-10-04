"use client";
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";
import { viVN as coreViVN } from "@mui/material/locale";
import { viVN as dateViVN } from "@mui/x-date-pickers/locales";
import { viVN as dataGridViVN } from "@mui/x-data-grid/locales";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
  selectsCustomizations,
  typographyCustomizations,
  inputsCustomizations,
  dataDisplayCustomizations,
  feedbackCustomizations,
  navigationCustomizations,
  surfacesCustomizations,
  buttonsCustomizations,
  toggleButtonsCustomizations,
  checkboxCustomizations,
} from "./customizations";

interface AppThemeProps {
  children: React.ReactNode;
  themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, themeComponents } = props;
  const theme = React.useMemo(() => {
    return createTheme(
      {
        cssVariables: {
          colorSchemeSelector: "data-mui-color-scheme",
          cssVarPrefix: "template",
        },
        colorSchemes,
        typography,
        shadows,
        shape,
        components: {
          ...inputsCustomizations,
          ...dataDisplayCustomizations,
          ...feedbackCustomizations,
          ...navigationCustomizations,
          ...surfacesCustomizations,
          ...chartsCustomizations,
          ...dataGridCustomizations,
          ...datePickersCustomizations,
          ...treeViewCustomizations,
          ...typographyCustomizations,
          ...selectsCustomizations,
          ...buttonsCustomizations,
          ...toggleButtonsCustomizations,
          ...checkboxCustomizations,
          ...themeComponents,
        },
      },
      dateViVN,
      dataGridViVN,
      coreViVN,
    );
  }, [themeComponents]);

  return (
    <ThemeProvider
      theme={theme}
      defaultMode="light"
      disableTransitionOnChange
      modeStorageKey="theme-mode"
    >
      {children}
    </ThemeProvider>
  );
}
