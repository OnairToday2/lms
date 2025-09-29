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
  orange,
  red,
  purple,
  green,
  yellow,
  blue,
} from "../themePrimitives";

/* eslint-disable import/prefer-default-export */
export const inputsCustomizations: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: {
      disableTouchRipple: false,
      disableRipple: false,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        boxSizing: "border-box",
        transition: "all 100ms ease-in",
        "&:focus-visible": {
          outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: "2px",
        },
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: "none",
        fontWeight: "600",
        variants: [
          {
            props: {
              size: "small",
            },
            style: {
              height: "2.25rem", //36px
              padding: "8px 12px",
              borderRadius: "8px",
            },
          },
          {
            props: {
              size: "medium",
            },
            style: {
              height: "2.5rem", // 40px
              borderRadius: "10px",
            },
          },
          {
            props: {
              size: "large",
            },
            style: {
              height: "2.75rem", // 44px
              borderRadius: "10px",
            },
          },
          {
            props: {
              color: "primary",
              variant: "contained",
            },
            style: {
              color: gray[50],
              backgroundColor: brand[600],
              "&:hover": {
                backgroundImage: "none",
                backgroundColor: brand[700],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: brand[700],
              },
              ...theme.applyStyles("dark", {
                color: gray[200],
                backgroundColor: brand[600],
                "&:hover": {
                  backgroundColor: brand[700],
                },
                "&:active": {
                  backgroundColor: brand[400],
                },
              }),
            },
          },
          {
            props: {
              color: "secondary",
              variant: "contained",
            },
            style: {
              color: "white",
              backgroundColor: purple[600],
              "&:hover": {
                backgroundColor: purple[700],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: purple[700],
                backgroundImage: "none",
              },
            },
          },
          {
            props: {
              color: "success",
              variant: "contained",
            },
            style: {
              color: "white",
              backgroundColor: green[600],
              "&:hover": {
                backgroundColor: green[700],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: green[700],
                backgroundImage: "none",
              },
            },
          },
          {
            props: {
              color: "warning",
              variant: "contained",
            },
            style: {
              color: "black",
              backgroundColor: yellow[400],
              "&:hover": {
                backgroundColor: yellow[500],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: yellow[700],
                backgroundImage: "none",
              },
            },
          },
          {
            props: {
              color: "error",
              variant: "contained",
            },
            style: {
              color: "white",
              backgroundColor: red[500],
              "&:hover": {
                backgroundColor: red[600],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: red[600],
                backgroundImage: "none",
              },
            },
          },
          {
            props: {
              color: "info",
              variant: "contained",
            },
            style: {
              color: "white",
              backgroundColor: blue[500],
              "&:hover": {
                backgroundColor: blue[600],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: blue[600],
                backgroundImage: "none",
              },
            },
          },
          {
            props: {
              color: "inherit",
              variant: "contained",
            },
            style: {
              color: "black",
              backgroundColor: gray[100],
              "&:hover": {
                backgroundColor: gray[200],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: gray[200],
                backgroundImage: "none",
              },
            },
          },
          {
            props: {
              color: "primary",
              variant: "outlined",
            },
            style: {
              color: brand[600],
              borderColor: brand[600],
              border: "1px solid",
              "&:hover": {
                backgroundColor: alpha(brand[200], 0.2),
                boxShadow: `0px 0px 0px 0.75px ${brand[600]}`,
              },
              "&:active": {
                backgroundColor: alpha(brand[200], 0.3),
                boxShadow: `0px 0px 0px 0.75px ${brand[600]}`,
              },
              ...theme.applyStyles("dark", {
                color: brand[600],
                borderColor: brand[600],
                border: "1px solid",
                "&:hover": {
                  color: brand[500],
                  borderColor: brand[500],
                  backgroundColor: alpha(brand[900], 0.3),
                  boxShadow: `0px 0px 0px 0.75px ${brand[500]}`,
                },
                "&:active": {
                  color: brand[500],
                  borderColor: brand[500],
                  backgroundColor: alpha(brand[900], 0.5),
                  boxShadow: `0px 0px 0px 0.75px ${brand[500]}`,
                },
              }),
            },
          },
          {
            props: {
              color: "secondary",
              variant: "outlined",
            },
            style: {
              color: purple[600],
              borderColor: purple[600],
              border: "1px solid",
              "&:hover": {
                backgroundColor: alpha(purple[200], 0.2),
                boxShadow: `0px 0px 0px 0.75px ${purple[600]}`,
              },
              "&:active": {
                backgroundColor: alpha(purple[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: purple[600],
                border: "1px solid",
                borderColor: purple[600],
                "&:hover": {
                  color: purple[500],
                  borderColor: purple[500],
                  backgroundColor: alpha(purple[900], 0.3),
                  boxShadow: `0px 0px 0px 0.75px ${purple[500]}`,
                },
                "&:active": {
                  borderColor: purple[500],
                  backgroundColor: alpha(purple[900], 0.5),
                  boxShadow: `0px 0px 0px 0.75px ${purple[500]}`,
                },
              }),
            },
          },
          {
            props: {
              color: "success",
              variant: "outlined",
            },
            style: {
              color: green[600],
              borderColor: green[600],
              border: "1px solid",
              "&:hover": {
                backgroundColor: alpha(green[200], 0.2),
                boxShadow: `0px 0px 0px 0.75px ${green[600]}`,
              },
              "&:active": {
                backgroundColor: alpha(green[200], 0.7),
                boxShadow: `0px 0px 0px 0.75px ${green[600]}`,
              },
              ...theme.applyStyles("dark", {
                color: green[600],
                border: "1px solid",
                borderColor: green[600],
                "&:hover": {
                  color: green[500],
                  backgroundColor: alpha(green[900], 0.3),
                  borderColor: green[500],
                  boxShadow: `0px 0px 0px 0.75px ${green[500]}`,
                },
                "&:active": {
                  color: green[500],
                  backgroundColor: alpha(green[900], 0.5),
                  borderColor: green[500],
                  boxShadow: `0px 0px 0px 0.75px ${green[500]}`,
                },
              }),
            },
          },
          {
            props: {
              color: "warning",
              variant: "outlined",
            },
            style: {
              color: yellow[500],
              border: "1px solid",
              borderColor: yellow[500],
              "&:hover": {
                backgroundColor: alpha(yellow[100], 0.2),
                borderColor: yellow[500],
                boxShadow: `0px 0px 0px 0.75px ${yellow[500]}`,
                color: yellow[500],
              },
              "&:active": {
                backgroundColor: alpha(yellow[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: yellow[500],
                border: "1px solid",
                borderColor: yellow[500],
                "&:hover": {
                  color: yellow[400],
                  borderColor: yellow[400],
                  backgroundColor: alpha(yellow[900], 0.3),
                  boxShadow: `0px 0px 0px 0.75px ${yellow[400]}`,
                },
                "&:active": {
                  backgroundColor: alpha(yellow[900], 0.5),
                },
              }),
            },
          },
          {
            props: {
              color: "error",
              variant: "outlined",
            },
            style: {
              color: red[500],
              border: "1px solid",
              borderColor: red[500],
              "&:hover": {
                backgroundColor: alpha(red[100], 0.2),
                borderColor: red[500],
                boxShadow: `0px 0px 0px 0.75px ${red[500]}`,
                color: red[500],
              },
              "&:active": {
                backgroundColor: alpha(red[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: red[600],
                border: "1px solid",
                borderColor: red[600],
                "&:hover": {
                  color: red[500],
                  borderColor: red[500],
                  backgroundColor: alpha(red[900], 0.3),
                  boxShadow: `0px 0px 0px 0.75px ${red[500]}`,
                },
                "&:active": {
                  backgroundColor: alpha(yellow[900], 0.5),
                },
              }),
            },
          },
          {
            props: {
              color: "info",
              variant: "outlined",
            },
            style: {
              color: blue[500],
              border: "1px solid",
              borderColor: blue[500],
              "&:hover": {
                backgroundColor: alpha(blue[100], 0.2),
                borderColor: blue[500],
                boxShadow: `0px 0px 0px 0.75px ${blue[500]}`,
                color: blue[500],
              },
              "&:active": {
                backgroundColor: alpha(blue[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: blue[600],
                border: "1px solid",
                borderColor: blue[600],
                "&:hover": {
                  color: blue[500],
                  borderColor: blue[500],
                  backgroundColor: alpha(blue[900], 0.3),
                  boxShadow: `0px 0px 0px 0.75px ${blue[500]}`,
                },
                "&:active": {
                  backgroundColor: alpha(yellow[900], 0.5),
                },
              }),
            },
          },
          {
            props: {
              variant: "text",
            },
            style: {
              color: gray[600],
              "&:hover": {
                backgroundColor: gray[100],
              },
              "&:active": {
                backgroundColor: gray[200],
              },
              ...theme.applyStyles("dark", {
                color: gray[50],
                "&:hover": {
                  backgroundColor: gray[700],
                },
                "&:active": {
                  backgroundColor: alpha(gray[700], 0.7),
                },
              }),
            },
          },
          {
            props: {
              color: "primary",
              variant: "text",
            },
            style: {
              color: brand[600],
              "&:hover": {
                backgroundColor: alpha(brand[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(brand[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: brand[700],
                "&:hover": {
                  backgroundColor: alpha(brand[900], 0.3),
                },
                "&:active": {
                  backgroundColor: alpha(brand[900], 0.3),
                },
              }),
            },
          },
          {
            props: {
              color: "secondary",
              variant: "text",
            },
            style: {
              color: purple[600],
              "&:hover": {
                backgroundColor: alpha(purple[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(purple[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: purple[700],
                "&:hover": {
                  backgroundColor: alpha(purple[900], 0.3),
                },
                "&:active": {
                  backgroundColor: alpha(purple[900], 0.3),
                },
              }),
            },
          },
          {
            props: {
              color: "success",
              variant: "text",
            },
            style: {
              color: green[600],
              "&:hover": {
                backgroundColor: alpha(green[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(green[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: green[700],
                "&:hover": {
                  backgroundColor: alpha(green[900], 0.3),
                },
                "&:active": {
                  backgroundColor: alpha(green[900], 0.3),
                },
              }),
            },
          },
          {
            props: {
              color: "warning",
              variant: "text",
            },
            style: {
              color: yellow[600],
              "&:hover": {
                backgroundColor: alpha(yellow[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(yellow[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: yellow[500],
                "&:hover": {
                  backgroundColor: alpha(yellow[900], 0.3),
                },
                "&:active": {
                  backgroundColor: alpha(yellow[900], 0.3),
                },
              }),
            },
          },
          {
            props: {
              color: "error",
              variant: "text",
            },
            style: {
              color: red[600],
              "&:hover": {
                backgroundColor: alpha(red[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(red[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: red[500],
                "&:hover": {
                  backgroundColor: alpha(red[900], 0.3),
                },
                "&:active": {
                  backgroundColor: alpha(red[900], 0.3),
                },
              }),
            },
          },
          {
            props: {
              color: "info",
              variant: "text",
            },
            style: {
              color: blue[600],
              "&:hover": {
                backgroundColor: alpha(blue[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(blue[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: blue[500],
                "&:hover": {
                  backgroundColor: alpha(blue[900], 0.3),
                },
                "&:active": {
                  backgroundColor: alpha(blue[900], 0.3),
                },
              }),
            },
          },
        ],
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: "none",
        fontWeight: theme.typography.fontWeightMedium,
        letterSpacing: 0,
        color: (theme.vars || theme).palette.text.primary,
        border: "1px solid ",
        borderColor: gray[200],
        backgroundColor: alpha(gray[50], 0.3),
        "&:hover": {
          backgroundColor: gray[100],
          borderColor: gray[300],
        },
        "&:active": {
          backgroundColor: gray[200],
        },
        ...theme.applyStyles("dark", {
          backgroundColor: gray[800],
          borderColor: gray[700],
          "&:hover": {
            backgroundColor: gray[900],
            borderColor: gray[600],
          },
          "&:active": {
            backgroundColor: gray[900],
          },
        }),
        variants: [
          {
            props: {
              size: "small",
            },
            style: {
              width: "2.25rem",
              height: "2.25rem",
              padding: "0.25rem",
              [`& .${svgIconClasses.root}`]: { fontSize: "1rem" },
            },
          },
          {
            props: {
              size: "medium",
            },
            style: {
              width: "2.5rem",
              height: "2.5rem",
            },
          },
        ],
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: "10px",
        boxShadow: `0 4px 16px ${alpha(gray[400], 0.2)}`,
        [`& .${toggleButtonGroupClasses.selected}`]: {
          color: brand[500],
        },
        ...theme.applyStyles("dark", {
          [`& .${toggleButtonGroupClasses.selected}`]: {
            color: "#fff",
          },
          boxShadow: `0 4px 16px ${alpha(brand[700], 0.5)}`,
        }),
      }),
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "12px 16px",
        textTransform: "none",
        borderRadius: "10px",
        fontWeight: theme.typography.fontWeightMedium,
        ...theme.applyStyles("dark", {
          color: gray[400],
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
          [`&.${toggleButtonClasses.selected}`]: {
            color: brand[300],
          },
        }),
      }),
    },
  },
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
          outline: `3px solid ${alpha(brand[500], 0.5)}`,
          outlineOffset: "2px",
          borderColor: brand[400],
        },
        "&.Mui-checked": {
          color: "white",
          backgroundColor: brand[500],
          borderColor: brand[500],
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
      }),
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        border: "none",
      },
      input: {
        "&::placeholder": {
          opacity: 0.7,
          color: gray[500],
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        padding: 0,
      },
      root: ({ theme }) => ({
        padding: "8px 12px",
        color: (theme.vars || theme).palette.text.primary,
        borderRadius: (theme.vars || theme).shape.borderRadius,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        backgroundColor: (theme.vars || theme).palette.background.default,
        transition: "border 120ms ease-in",
        "&:hover": {
          borderColor: gray[400],
        },
        [`&.${outlinedInputClasses.focused}`]: {
          outline: `0px solid ${alpha(brand[500], 0.5)}`,
          borderColor: brand[400],
        },
        ...theme.applyStyles("dark", {
          "&:hover": {
            borderColor: gray[500],
          },
        }),
        variants: [
          {
            props: {
              size: "small",
            },
            style: {
              height: "2.25rem",
            },
          },
          {
            props: {
              size: "medium",
            },
            style: {
              height: "2.5rem",
            },
          },
        ],
      }),
      notchedOutline: {
        border: "none",
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: (theme.vars || theme).palette.grey[500],
        ...theme.applyStyles("dark", {
          color: (theme.vars || theme).palette.grey[400],
        }),
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        typography: theme.typography.caption,
        marginBottom: 8,
      }),
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
      }),
    },
  },
};
