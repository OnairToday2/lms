"use client";
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplayCustomizations } from "./customizations/dataDisplay";
import { feedbackCustomizations } from "./customizations/feedback";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./customizations";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";
import { viVN as coreViVN } from "@mui/material/locale";
import { viVN as dateViVN } from "@mui/x-date-pickers/locales";
import { viVN as dataGridViVN } from "@mui/x-data-grid";

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme(
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
              ...themeComponents,
            },
          },
          dateViVN,
          dataGridViVN,
          coreViVN,
        );
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider
      theme={theme}
      disableTransitionOnChange
      defaultMode="light"
      modeStorageKey="theme-mode"
    >
      {children}
    </ThemeProvider>
  );
}
