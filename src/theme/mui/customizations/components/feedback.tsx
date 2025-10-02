import { Theme, alpha, Components } from "@mui/material/styles";
import { grey, warning } from "../../theme-color";

/* eslint-disable import/prefer-default-export */
export const feedbackCustomizations: Components<Theme> = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 10,
        backgroundColor: warning["main"],
        color: (theme.vars || theme).palette.text.primary,
        border: `1px solid ${alpha(warning["main"], 0.5)}`,
        "& .MuiAlert-icon": {
          color: warning["main"],
        },
        ...theme.applyStyles("dark", {
          backgroundColor: `${alpha(warning["main"], 0.5)}`,
          border: `1px solid ${alpha(warning["main"], 0.5)}`,
        }),
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
