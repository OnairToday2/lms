import { Theme, Components } from "@mui/material/styles";
import { tabClasses, tabsClasses } from "@mui/material";
import { grey } from "../../theme-color";
/* eslint-disable import/prefer-default-export */
export const tabsCustomization: Components<Theme> = {
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        //   background: "red !important",
        ...theme.applyStyles("dark", {}),
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: ({ theme }) => ({
        [".MuiTabs-list"]: {
          position: "relative",
          zIndex: 10,
        },
        ...theme.applyStyles("dark", {}),
      }),
    },
  },
};
