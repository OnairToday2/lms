import React from "react";
import { alpha, Theme, Components } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { inputBaseClasses, selectClasses, SvgIconProps } from "@mui/material";
import { grey } from "../../theme-color";
export const selectsCustomizations: Components<Theme> = {
  MuiSelect: {
    defaultProps: {
      IconComponent: React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
        <KeyboardArrowDownIcon fontSize="small" {...props} ref={ref} />
      )),
    },
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${inputBaseClasses.root}`]: {
          borderBottom: "1px solid",
        },

        "&.MuiFilledInput-root": {
          backgroundColor: theme.palette.grey[200],
        },
        // borderRadius: (theme.vars || theme).shape.borderRadius,
        // // border: "1px solid",
        // borderColor: theme.palette.grey[400],
        // backgroundColor: (theme.vars || theme).palette.background.paper,
        // // boxShadow: `inset 0 1px 0 1px hsla(220, 0%, 100%, 0.6), inset 0 -1px 0 1px hsla(220, 35%, 90%, 0.5)`,
        // "&:hover": {
        //   borderColor: grey[400],
        //   backgroundColor: (theme.vars || theme).palette.background.paper,
        //   boxShadow: "none",
        // },
        // [`&.${selectClasses.focused}`]: {
        //   outlineOffset: 0,
        //   borderColor: theme.palette.primary["main"],
        // },
        // "&:before, &:after": {
        //   display: "none",
        // },
        // ...theme.applyStyles("dark", {
        //   borderColor: grey[700],
        //   backgroundColor: (theme.vars || theme).palette.background.paper,
        //   boxShadow: `inset 0 1px 0 1px ${alpha(
        //     grey[700],
        //     0.15,
        //   )}, inset 0 -1px 0 1px hsla(220, 0%, 0%, 0.7)`,
        //   "&:hover": {
        //     borderColor: alpha(grey[700], 0.7),
        //     backgroundColor: (theme.vars || theme).palette.background.paper,
        //     boxShadow: "none",
        //   },
        //   [`&.${selectClasses.focused}`]: {
        //     outlineOffset: 0,
        //     borderColor: grey[900],
        //   },
        //   "&:before, &:after": {
        //     display: "none",
        //   },
        // }),
        // variants: [
        //   {
        //     props: {
        //       size: "small",
        //     },
        //     style: {
        //       height: "2.25rem",
        //     },
        //   },
        //   {
        //     props: {
        //       size: "medium",
        //     },
        //     style: {
        //       height: "2.5rem",
        //     },
        //   },
        // ],
      }),
      select: ({ theme }) => ({
        display: "flex",
        alignItems: "center",
        ...theme.applyStyles("dark", {
          display: "flex",
          alignItems: "center",
          "&:focus-visible": {
            backgroundColor: grey[900],
          },
        }),
      }),
    },
  },
};
