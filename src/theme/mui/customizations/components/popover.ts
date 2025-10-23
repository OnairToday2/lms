import * as React from "react";
import { alpha, Theme, Components } from "@mui/material/styles";

/* eslint-disable import/prefer-default-export */
export const popoverCustomizations: Components<Theme> = {
  MuiPopover: {
    defaultProps: {},

    styleOverrides: {
      root: {},
      paper: () => ({
        backgroundColor: "white",
        boxShadow: "0px 4px 8px -4px rgb(0 0 0 / 10%), 0px 6px 12px -4px rgb(0 0 0 / 10%)",
      }),
    },
  },
};
