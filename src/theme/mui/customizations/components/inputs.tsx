import * as React from "react";
import { alpha, Theme, Components } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import {
  grey,
  primary,
  secondary,
  success,
  info,
  error,
} from "../../theme-color";

/* eslint-disable import/prefer-default-export */
export const inputsCustomizations: Components<Theme> = {
  MuiInputBase: {
    styleOverrides: {
      root: {
        border: "none",
      },
      input: {
        padding: "0.5rem 0.875rem",
        "&::placeholder": {
          opacity: 0.7,
          color: grey[600],
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        paddingInlineStart: "0.125rem",
        paddingInlineEnd: "0.125rem",
        [`&.MuiInputLabel-outlined`]: {
          backgroundColor: "white",
        },
        ...theme.applyStyles("dark", {
          [`&.MuiInputLabel-outlined.MuiFormLabel-filled`]: {
            backgroundColor: "black",
          },
        }),
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        padding: "0.5rem 0.875rem",
      },
      root: ({ theme }) => ({
        // padding: "0.5rem 0.75rem",
        color: (theme.vars || theme).palette.text.primary,
        borderRadius: (theme.vars || theme).shape.borderRadius,
        border: `1px solid`,
        borderColor: grey[600],
        backgroundColor: (theme.vars || theme).palette.background.default,
        transition: "border 120ms ease-in",
        "&:hover": {
          borderColor: grey[400],
        },
        [`&.${outlinedInputClasses.focused}`]: {
          outline: `0px solid ${alpha(primary["main"], 0.5)}`,
          borderColor: primary["main"],
        },
        ...theme.applyStyles("dark", {
          "&:hover": {
            borderColor: primary["main"],
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
        color: "hsla(0, 0%, 0%, 1)",
        marginBottom: 8,
      }),
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        ["&::after"]: {
          border: "none",
        },
        ["&::before"]: {
          border: "none",
          content: "none",
        },
      }),
    },
  },
};
