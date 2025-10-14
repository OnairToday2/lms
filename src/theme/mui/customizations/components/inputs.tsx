import { alpha, Theme, Components } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { grey, primary, error } from "../../theme-color";
import {
  filledInputClasses,
  formLabelClasses,
  inputBaseClasses,
} from "@mui/material";

/* eslint-disable import/prefer-default-export */
export const inputsCustomizations: Components<Theme> = {
  MuiInputBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&::placeholder": {
          opacity: 0.7,
          color: grey[600],
        },
      }),
      input: ({ theme }) => ({
        padding: "0.5rem 0.875rem",
      }),
    },
  },
  // MuiInputLabel: {
  //   styleOverrides: {
  //     root: ({ theme }) => ({
  //       paddingInlineStart: "0.125rem",
  //       paddingInlineEnd: "0.125rem",
  //       [`&.MuiInputLabel-outlined`]: {
  //         backgroundColor: "white",
  //       },
  //       ...theme.applyStyles("dark", {
  //         [`&.MuiInputLabel-outlined.MuiFormLabel-filled`]: {
  //           backgroundColor: "black",
  //         },
  //       }),
  //     }),
  //   },
  // },
  MuiOutlinedInput: {
    styleOverrides: {
      // input: {
      //   padding: "0.5rem 0.875rem",
      // },
      root: ({ theme }) => ({
        color: (theme.vars || theme).palette.text.primary,
        borderColor: theme.palette.grey[400],
        // backgroundColor: (theme.vars || theme).palette.background.default,
        // transition: "border 120ms ease-in",
        // "&:hover": {
        //   borderColor: grey[400],
        // },
        fontSize: theme.typography.fontSize,
        [`&.${outlinedInputClasses.focused}`]: {
          // outline: `0px solid ${alpha(primary["main"], 0.5)}`,
          borderColor: primary["main"],
        },
        [`&.${outlinedInputClasses.error}`]: {
          borderColor: error["main"],
        },
        ...theme.applyStyles("dark", {
          "&:hover": {
            borderColor: primary["main"],
          },
        }),
      }),
      notchedOutline: ({ theme }) => ({
        borderColor: theme.palette.grey[400],
      }),
      input: {
        // height: "1.4375rem",
        variants: [
          {
            props: {
              size: "small",
            },
            style: ({ theme }) => ({
              padding: "0.625rem 0.875rem",
            }),
          },
          {
            props: {
              size: "medium",
            },
            style: ({ theme }) => ({
              padding: "0.875rem 0.875rem",
            }),
          },
        ],
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: (theme.vars || theme).palette.grey[400],
        "&:hover": (theme.vars || theme).palette.grey[600],
        ...theme.applyStyles("dark", {
          color: (theme.vars || theme).palette.grey[400],
        }),
      }),
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        width: "100%",
        // "& .MuiInput-root": {
        //   padding: "0.5rem 0.875rem",
        //   backgroundColor: "transparent",
        // },
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        typography: theme.typography.caption,
        color: "hsla(0, 0%, 0%, 1)",
        marginBottom: 8,
        fontWeight: 600,
        fontSize: theme.typography.fontSize,
        [`&.${formLabelClasses.focused}`]: {
          color: "inherit",
        },
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
  MuiTextField: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        variants: [
          {
            props: {
              variant: "outlined",
            },
          },
          {
            props: {
              variant: "filled",
            },
            style: (theme) => ({
              [`& .${filledInputClasses.root}`]: {
                [`&.${filledInputClasses.error}`]: {
                  backgroundColor: error[8],
                },
              },
            }),
          },
        ],
      }),
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        marginLeft: "-10px",
      }),
    },
  },
};
