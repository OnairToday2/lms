import * as React from "react";
import { alpha, Theme, Components } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { svgIconClasses } from "@mui/material/SvgIcon";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import {
  gray,
  brand,
  red,
  purple,
  green,
  yellow,
  blue,
} from "../../themePrimitives";

/* eslint-disable import/prefer-default-export */
export const checkboxCustomizations: Components<Theme> = {
  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
      icon: (
        <CheckBoxOutlineBlankRoundedIcon
          sx={{ color: "hsla(210, 0%, 0%, 0.0)" }}
        />
      ),
      checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
      indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 10,
        height: 16,
        width: 16,
        borderRadius: 5,
        border: "1px solid ",
        borderColor: alpha(gray[300], 0.8),
        boxShadow: "0 0 0 1.5px hsla(210, 0%, 0%, 0.04) inset",
        backgroundColor: alpha(gray[100], 0.4),
        transition: "border-color, background-color, 120ms ease-in",
        "&:hover": {
          borderColor: brand[300],
        },
        "&.Mui-focusVisible": {
          outline: `3px solid ${alpha(brand[600], 0.5)}`,
          outlineOffset: "2px",
          borderColor: brand[400],
        },
        "&.Mui-checked": {
          color: "white",
          backgroundColor: brand[600],
          borderColor: brand[700],
          boxShadow: `none`,
          "&:hover": {
            backgroundColor: brand[600],
          },
        },
        ...theme.applyStyles("dark", {
          borderColor: alpha(gray[700], 0.8),
          boxShadow: "0 0 0 1.5px hsl(210, 0%, 0%) inset",
          backgroundColor: alpha(gray[900], 0.8),
          "&:hover": {
            borderColor: brand[300],
          },
          "&.Mui-focusVisible": {
            borderColor: brand[400],
            outline: `3px solid ${alpha(brand[500], 0.5)}`,
            outlineOffset: "2px",
          },
        }),
        variants: [
          {
            props: {
              color: "primary",
            },
            style: {
              color: brand[600],
              "&:hover": {
                borderColor: brand[300],
              },
              "&.Mui-focusVisible": {
                outline: `3px solid ${alpha(brand[600], 0.5)}`,
                outlineOffset: "2px",
                borderColor: brand[400],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: brand[600],
                borderColor: brand[600],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: brand[700],
                  borderColor: brand[700],
                },
              },
            },
          },
          {
            props: {
              color: "secondary",
            },
            style: {
              color: purple[600],
              "&:hover": {
                borderColor: purple[300],
              },
              "&.Mui-focusVisible": {
                outline: `3px solid ${alpha(purple[600], 0.5)}`,
                outlineOffset: "2px",
                borderColor: purple[400],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: purple[600],
                borderColor: purple[600],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: purple[700],
                  borderColor: purple[700],
                },
              },
            },
          },
          {
            props: {
              color: "success",
            },
            style: {
              color: green[600],
              "&:hover": {
                borderColor: green[500],
              },
              "&.Mui-focusVisible": {
                outline: `3px solid ${alpha(green[600], 0.5)}`,
                outlineOffset: "2px",
                borderColor: green[400],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: green[600],
                borderColor: green[600],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: green[700],
                  borderColor: green[700],
                },
              },
            },
          },
          {
            props: {
              color: "warning",
            },
            style: {
              color: yellow[400],
              "&:hover": {
                borderColor: yellow[400],
              },
              "&.Mui-focusVisible": {
                outline: `3px solid ${alpha(yellow[600], 0.5)}`,
                outlineOffset: "2px",
                borderColor: yellow[400],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: yellow[400],
                borderColor: yellow[400],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: yellow[500],
                  borderColor: yellow[500],
                },
              },
            },
          },
          {
            props: {
              color: "info",
            },
            style: {
              color: blue[400],
              "&:hover": {
                borderColor: blue[400],
              },
              "&.Mui-focusVisible": {
                outline: `3px solid ${alpha(blue[600], 0.5)}`,
                outlineOffset: "2px",
                borderColor: blue[400],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: blue[600],
                borderColor: blue[600],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: blue[700],
                  borderColor: blue[700],
                },
              },
            },
          },
          {
            props: {
              color: "error",
            },
            style: {
              color: red[400],
              "&:hover": {
                borderColor: red[400],
              },
              "&.Mui-focusVisible": {
                outline: `3px solid ${alpha(red[600], 0.5)}`,
                outlineOffset: "2px",
                borderColor: red[400],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: red[600],
                borderColor: red[600],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: red[700],
                  borderColor: red[700],
                },
              },
            },
          },
        ],
      }),
    },
  },
};
