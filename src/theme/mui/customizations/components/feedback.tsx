import { Theme, alpha, Components } from "@mui/material/styles";
import { grey, warning } from "../../theme-color";

/* eslint-disable import/prefer-default-export */
export const feedbackCustomizations: Components<Theme> = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        color: (theme.vars || theme).palette.text.primary,
        ...theme.applyStyles("dark", {
          // backgroundColor: `${alpha(warning["main"], 0.5)}`,
          // border: `1px solid ${alpha(warning["main"], 0.5)}`,
        }),
        variants: [
          {
            props: {
              severity: "error",
              variant: "filled",
            },
            style: ({ theme }) => ({
              // color: "white",
              // backgroundColor: theme.palette.error.main,
              // "& .MuiAlert-icon": {
              //   color: warning["main"],
              // },
            }),
          },
        ],
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          border: "1px solid",
          borderColor: (theme.vars || theme).palette.divider,
          backgroundColor: "white",
        },
        "& .MuiDialogContent-root": {
          scrollbarWidth: "thin",
        },
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 8,
        borderRadius: 8,
        backgroundColor: grey[200],
        ...theme.applyStyles("dark", {
          backgroundColor: grey[800],
        }),
      }),
    },
  },
};
