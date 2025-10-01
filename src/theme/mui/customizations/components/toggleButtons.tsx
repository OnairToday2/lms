import { alpha, Theme, Components } from "@mui/material/styles";
import { svgIconClasses } from "@mui/material/SvgIcon";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import {
  primary,
  grey,
  secondary,
  success,
  warning,
  error,
  info,
} from "../../theme-color";

/* eslint-disable import/prefer-default-export */

export const toggleButtonsCustomizations: Components<Theme> = {
  MuiToggleButtonGroup: {
    defaultProps: {
      // color: "primary",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        width: "fit-content",
        [`& .${toggleButtonGroupClasses.selected}`]: {
          color: "white",
        },
        ...theme.applyStyles("dark", {
          [`& .${toggleButtonGroupClasses.selected}`]: {
            color: primary["light"],
          },
        }),
        variant: [
          {
            props: {
              orientation: "vertical",
            },
            style: {
              width: "fit-content",
              [`& .${toggleButtonClasses.root}`]: {
                display: "inline-block",
              },
            },
          },
          {
            props: {
              orientation: "vertical",
            },
            style: {
              width: "fit-content",
            },
          },
        ],
      }),
    },
  },

  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: "none",
        fontWeight: theme.typography.fontWeightBold,
        ...theme.applyStyles("dark", {
          color: grey[400],
          [`&.${toggleButtonClasses.selected}`]: {
            color: primary["main"],
          },
        }),
        variants: [
          {
            props: {
              size: "small",
            },
            style: {
              height: "1.875rem", //30px
              borderRadius: "0.5rem", // 8px
              fontSize: "0.75rem",
              padding: "0.125rem 0.375rem",
              [`& .${svgIconClasses.root}`]: { fontSize: "1rem" },
            },
          },
          {
            props: {
              size: "medium",
            },
            style: {
              height: "2.25rem", // 36px
              borderRadius: "0.5rem", //8px
              padding: "0.25rem 0.5rem",
            },
          },
          {
            props: {
              size: "large",
            },
            style: {
              height: "2.5rem", // 40px
              borderRadius: "0.5rem", //8px
              padding: "0.25rem 0.75rem",
            },
          },
          {
            props: {
              color: "primary",
            },
            style: {
              color: "white",
              background: primary["main"],
              borderColor: primary["main"],
              [`& .${toggleButtonGroupClasses.middleButton}`]: {
                borderLeftColor: "red",
              },
              [`&.${toggleButtonClasses.selected}`]: {
                color: "white",
                backgroundColor: primary["dark"],
                borderColor: primary["dark"],
                "&:hover": {
                  backgroundColor: primary["dark"],
                  borderColor: primary["dark"],
                },
              },
              "&:hover": {
                backgroundColor: primary["dark"],
                borderColor: primary["dark"],
              },
              [`&.${toggleButtonClasses.disabled}`]: {
                color: "white",
                opacity: 0.6,
                backgroundColor: alpha(primary["dark"], 1),
                borderColor: alpha(primary["dark"], 1),
                "&:hover": {
                  backgroundColor: alpha(primary["dark"], 1),
                  borderColor: alpha(primary["dark"], 1),
                },
              },
            },
          },
          {
            props: {
              color: "secondary",
            },
            style: {
              color: "white",
              background: secondary["main"],
              borderColor: secondary["main"],
              [`&.${toggleButtonClasses.selected}`]: {
                color: "white",
                backgroundColor: secondary["dark"],
                borderColor: secondary["dark"],
                "&:hover": {
                  backgroundColor: secondary["dark"],
                  borderColor: secondary["dark"],
                },
              },
              "&:hover": {
                backgroundColor: secondary["dark"],
                borderColor: secondary["dark"],
              },
              [`&.${toggleButtonClasses.disabled}`]: {
                color: "white",
                opacity: 0.6,
                backgroundColor: secondary["dark"],
                borderColor: secondary["dark"],
              },
            },
          },
          {
            props: {
              color: "success",
            },
            style: {
              color: "white",
              background: success["main"],
              borderColor: success["main"],
              [`&.${toggleButtonClasses.selected}`]: {
                color: "white",
                backgroundColor: success["dark"],
                borderColor: success["dark"],
                "&:hover": {
                  backgroundColor: success["dark"],
                  borderColor: success["dark"],
                },
              },
              "&:hover": {
                backgroundColor: success["dark"],
                borderColor: success["dark"],
              },
              [`&.${toggleButtonClasses.disabled}`]: {
                color: alpha(grey[300], 0.8),
                opacity: 0.6,
                backgroundColor: success["dark"],
                borderColor: success["dark"],
              },
            },
          },
          {
            props: {
              color: "info",
            },
            style: {
              color: "white",
              background: info["main"],
              borderColor: info["main"],
              [`&.${toggleButtonClasses.selected}`]: {
                color: "white",
                backgroundColor: info["dark"],
                borderColor: info["dark"],
                "&:hover": {
                  backgroundColor: info["dark"],
                  borderColor: info["dark"],
                },
              },
              "&:hover": {
                backgroundColor: info["dark"],
                borderColor: info["dark"],
              },
              [`&.${toggleButtonClasses.disabled}`]: {
                color: alpha(grey[300], 0.8),
                backgroundColor: alpha(info["dark"], 0.9),
                borderColor: info["dark"],
                "&:hover": {
                  backgroundColor: info["dark"],
                  borderColor: info["dark"],
                },
              },
            },
          },
          {
            props: {
              color: "warning",
            },
            style: {
              color: "white",
              background: warning["main"],
              borderColor: warning["main"],
              [`&.${toggleButtonClasses.selected}`]: {
                color: "white",
                backgroundColor: warning["dark"],
                borderColor: warning["dark"],
                "&:hover": {
                  backgroundColor: warning["dark"],
                  borderColor: warning["dark"],
                },
              },
              "&:hover": {
                backgroundColor: warning["dark"],
                borderColor: warning["dark"],
              },
              [`&.${toggleButtonClasses.disabled}`]: {
                color: alpha(grey[300], 0.8),
                backgroundColor: alpha(warning["dark"], 0.9),
                borderColor: warning["dark"],
                "&:hover": {
                  backgroundColor: warning["dark"],
                  borderColor: warning["dark"],
                },
              },
            },
          },
          {
            props: {
              color: "success",
            },
            style: {
              color: "white",
              background: success["main"],
              borderColor: success["main"],
              [`&.${toggleButtonClasses.selected}`]: {
                color: "white",
                backgroundColor: success["dark"],
                borderColor: success["dark"],
                "&:hover": {
                  backgroundColor: success["dark"],
                  borderColor: success["dark"],
                },
              },
              "&:hover": {
                backgroundColor: success["dark"],
                borderColor: success["dark"],
              },
              [`&.${toggleButtonClasses.disabled}`]: {
                color: alpha(grey[300], 0.8),
                backgroundColor: alpha(success["dark"], 0.9),
                borderColor: success["dark"],
                "&:hover": {
                  backgroundColor: success["dark"],
                  borderColor: success["dark"],
                },
              },
            },
          },
          {
            props: {
              color: "error",
            },
            style: {
              color: "white",
              background: error["main"],
              borderColor: error["main"],
              [`&.${toggleButtonClasses.selected}`]: {
                color: "white",
                backgroundColor: error["dark"],
                borderColor: error["dark"],
                "&:hover": {
                  backgroundColor: error["dark"],
                  borderColor: error["dark"],
                },
              },
              "&:hover": {
                backgroundColor: error["dark"],
                borderColor: error["dark"],
              },
              [`&.${toggleButtonClasses.disabled}`]: {
                color: alpha(grey[300], 0.8),
                backgroundColor: alpha(error["dark"], 0.9),
                borderColor: error["dark"],
                "&:hover": {
                  backgroundColor: error["dark"],
                  borderColor: error["dark"],
                },
              },
            },
          },
          {
            props: {
              color: "standard",
            },
            style: {
              color: "white",
              background: grey[800],
              borderColor: grey[800],
              [`&.${toggleButtonClasses.selected}`]: {
                color: "white",
                backgroundColor: grey[900],
                borderColor: grey[900],
                "&:hover": {
                  backgroundColor: grey[800],
                  borderColor: grey[800],
                },
              },
              "&:hover": {
                backgroundColor: grey[800],
                borderColor: grey[800],
              },
              [`&.${toggleButtonClasses.disabled}`]: {
                color: alpha(grey[300], 0.8),
                backgroundColor: alpha(grey[800], 0.9),
                borderColor: grey[800],
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
};
