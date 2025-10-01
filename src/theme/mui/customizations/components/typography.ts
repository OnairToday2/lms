import * as React from "react";
import { alpha, Theme, Components } from "@mui/material/styles";

/* eslint-disable import/prefer-default-export */
export const typographyCustomizations: Components<Theme> = {
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        h1: "h1",
        h2: "h2",
        h3: "h2",
        h4: "h2",
        h5: "h2",
        h6: "h2",
        subtitle1: "h2",
        subtitle2: "h2",
        body1: "span",
        body2: "span",
      },
    },
  },
};
