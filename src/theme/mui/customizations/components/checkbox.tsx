import * as React from "react";
import { alpha, Theme, Components } from "@mui/material/styles";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import {
  primary,
  secondary,
  grey,
  success,
  warning,
  info,
  error,
} from "../../theme-color";

/* eslint-disable import/prefer-default-export */
export const checkboxCustomizations: Components<Theme> = {
  MuiCheckbox: {
    defaultProps: {
      // disableRipple: true,
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
        margin: "0.5rem",
        height: "1.125rem",
        width: "1.125rem",
        borderRadius: "0.375rem",
        border: "2px solid ",
        borderColor: grey[600],
        transition: "border-color, background-color, 120ms ease-in",
        // ...theme.applyStyles("dark", {
        //   borderColor: alpha(gray[700], 0.8),
        //   boxShadow: "0 0 0 1.5px hsl(210, 0%, 0%) inset",
        //   backgroundColor: alpha(gray[900], 0.8),
        //   "&:hover": {
        //     borderColor: brand[300],
        //   },
        //   "&.Mui-focusVisible": {
        //     borderColor: brand[400],
        //     outline: `3px solid ${alpha(brand[500], 0.5)}`,
        //     outlineOffset: "2px",
        //   },
        // }),
        variants: [
          {
            props: {
              color: "primary",
            },
            style: {
              color: primary["main"],
              "&:hover": {
                borderColor: primary["main"],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: primary["main"],
                borderColor: primary["main"],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: primary["main"],
                  borderColor: primary["main"],
                },
              },
            },
          },
          {
            props: {
              color: "secondary",
            },
            style: {
              color: secondary["main"],
              "&:hover": {
                borderColor: secondary["main"],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: secondary["main"],
                borderColor: secondary["main"],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: secondary["main"],
                  borderColor: secondary["main"],
                },
              },
            },
          },
          {
            props: {
              color: "success",
            },
            style: {
              color: success["main"],
              "&:hover": {
                borderColor: success["main"],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: success["main"],
                borderColor: success["main"],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: success["main"],
                  borderColor: success["main"],
                },
              },
            },
          },
          {
            props: {
              color: "warning",
            },
            style: {
              color: warning["main"],
              "&:hover": {
                borderColor: warning["main"],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: warning["main"],
                borderColor: warning["main"],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: warning["main"],
                  borderColor: warning["main"],
                },
              },
            },
          },
          {
            props: {
              color: "info",
            },
            style: {
              color: info["main"],
              "&:hover": {
                borderColor: info["main"],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: info["main"],
                borderColor: info["main"],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: info["main"],
                  borderColor: info["main"],
                },
              },
            },
          },
          {
            props: {
              color: "error",
            },
            style: {
              color: error["main"],
              "&:hover": {
                borderColor: error["main"],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: error["main"],
                borderColor: error["main"],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: error["main"],
                  borderColor: error["main"],
                },
              },
            },
          },
          {
            props: {
              color: "default",
            },
            style: {
              color: "white",
              "&:hover": {
                borderColor: grey[800],
              },
              "&.Mui-checked": {
                color: "white",
                backgroundColor: grey[800],
                borderColor: grey[800],
                boxShadow: `none`,
                "&:hover": {
                  backgroundColor: grey[800],
                  borderColor: grey[800],
                },
              },
            },
          },
        ],
      }),
    },
  },
  MuiRadio: {
    defaultProps: {
      color: "primary",
      disableRipple: false,
      // icon: (
      //   <CheckBoxOutlineBlankRoundedIcon
      //     sx={{ color: "hsla(210, 0%, 0%, 0.0)" }}
      //   />
      // ),
      // checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 10,
        height: 16,
        width: 16,
        borderRadius: 16,
        border: "1px solid ",
        // borderColor: alpha(gray[300], 0.8),
        // boxShadow: "0 0 0 1.5px hsla(210, 0%, 0%, 0.04) inset",
        backgroundColor: alpha(grey[100], 0.4),
        transition: "border-color, background-color, 120ms ease-in",
        variants: [
          {
            props: {
              color: "primary",
            },
            style: {
              color: primary["main"],
              "&:hover": {
                borderColor: primary["main"],
              },
              "&.Mui-checked": {
                color: primary["main"],
                "&:hover": {
                  color: primary["main"],
                },
              },
            },
          },
          {
            props: {
              color: "secondary",
            },
            style: {
              color: secondary["main"],
              "&:hover": {
                borderColor: secondary["main"],
              },
              "&.Mui-checked": {
                color: secondary["main"],
                "&:hover": {
                  color: secondary["main"],
                },
              },
            },
          },
          {
            props: {
              color: "success",
            },
            style: {
              color: success["main"],
              "&:hover": {
                borderColor: success["main"],
              },
              "&.Mui-checked": {
                color: success["main"],
                "&:hover": {
                  color: success["main"],
                },
              },
            },
          },
          {
            props: {
              color: "warning",
            },
            style: {
              color: warning["main"],
              "&:hover": {
                borderColor: warning["main"],
              },
              "&.Mui-checked": {
                color: warning["main"],
                "&:hover": {
                  color: warning["main"],
                },
              },
            },
          },
          {
            props: {
              color: "error",
            },
            style: {
              color: error["main"],
              "&:hover": {
                borderColor: error["main"],
              },
              "&.Mui-checked": {
                color: error["main"],
                "&:hover": {
                  color: error["main"],
                },
              },
            },
          },
          {
            props: {
              color: "info",
            },
            style: {
              color: info["main"],
              "&:hover": {
                borderColor: info["main"],
              },
              "&.Mui-checked": {
                color: info["main"],
                "&:hover": {
                  color: info["main"],
                },
              },
            },
          },
          {
            props: {
              color: "default",
            },
            style: {
              color: grey[800],
              "&:hover": {
                borderColor: grey[800],
              },
              "&.Mui-checked": {
                color: grey[800],
                "&:hover": {
                  color: grey[800],
                },
              },
            },
          },
        ],
      }),
    },
  },
};
