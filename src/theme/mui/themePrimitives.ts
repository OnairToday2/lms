import {
  createTheme,
  alpha,
  PaletteMode,
  Shadows,
  ColorSystemOptions,
  ThemeOptions,
} from "@mui/material/styles";
import {
  grey,
  primary,
  info,
  warning,
  error,
  secondary,
  success,
} from "./theme-color";
import { Theme } from "@emotion/react";
export * from "./primitive/typography";

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] =
    mode === "dark"
      ? "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px"
      : "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px";

  return {
    palette: {
      mode,
      primary: {
        light: primary["light"],
        main: primary["main"],
        dark: primary["dark"],
        contrastText: grey[900],
        ...(mode === "dark" && {
          contrastText: grey[100],
          light: primary["light"],
          main: primary["main"],
          dark: primary["dark"],
        }),
      },
      info: {
        light: info["light"],
        main: info["main"],
        dark: info["dark"],
        contrastText: grey[100],
        ...(mode === "dark" && {
          contrastText: grey[300],
          light: info["light"],
          main: info["main"],
          dark: info["dark"],
        }),
      },
      warning: {
        light: warning["light"],
        main: warning["main"],
        dark: warning["dark"],
        ...(mode === "dark" && {
          light: warning["light"],
          main: warning["main"],
          dark: warning["dark"],
        }),
      },
      error: {
        light: error["light"],
        main: error["main"],
        dark: error["dark"],
        ...(mode === "dark" && {
          light: error["light"],
          main: error["main"],
          dark: error["dark"],
        }),
      },
      success: {
        light: success["light"],
        main: success["main"],
        dark: success["dark"],
        ...(mode === "dark" && {
          light: success["light"],
          main: success["main"],
          dark: success["dark"],
        }),
      },
      grey: {
        ...grey,
      },
      divider: mode === "dark" ? alpha(grey[700], 0.6) : alpha(grey[300], 0.4),
      background: {
        default: "hsl(0, 0%, 99%)",
        paper: "hsl(220, 35%, 97%)",
        ...(mode === "dark" && {
          default: grey[900],
          paper: "hsl(220, 30%, 7%)",
        }),
      },
      text: {
        primary: grey[800],
        secondary: grey[600],
        warning: warning["main"],
        ...(mode === "dark" && {
          primary: "hsl(0, 0%, 100%)",
          secondary: grey[400],
        }),
      },
      action: {
        hover: alpha(grey[200], 0.2),
        selected: `${alpha(grey[200], 0.3)}`,
        ...(mode === "dark" && {
          hover: alpha(grey[600], 0.2),
          selected: alpha(grey[600], 0.3),
        }),
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
        "@media (min-width:600px)": {
          fontSize: "1.5rem",
        },
        [defaultTheme.breakpoints.up("md")]: {
          fontSize: defaultTheme.typography.pxToRem(111),
        },
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius6: 6,
      borderRadius: 8,
      borderRadius10: 10,
      borderRadius12: 12,
    },
    shadows: customShadows,
  };
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: primary["light"],
        main: primary["main"],
        dark: primary["dark"],
        contrastText: grey["800"],
      },
      info: {
        light: info["light"],
        main: info["main"],
        dark: info["dark"],
        contrastText: grey["800"],
      },
      warning: {
        light: warning["light"],
        main: warning["main"],
        dark: warning["dark"],
      },
      error: {
        ...error,
      },
      success: {
        light: success["light"],
        main: success["main"],
        dark: success["dark"],
        darker: "",
      },
      grey: {
        ...grey,
      },
      divider: alpha(grey[500], 0.2),
      background: {
        default: "hsl(0, 0%, 99%)",
        paper: "hsl(220, 35%, 97%)",
      },
      text: {
        primary: grey[800],
        secondary: grey[600],
        warning: warning["main"],
      },
      action: {
        hover: alpha(grey[500], 0.08),
        selected: alpha(grey[500], 0.16),
        focus: alpha(grey[500], 0.24),
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: primary["lighter"],
        light: primary["light"],
        main: primary["main"],
        dark: primary["dark"],
      },
      info: {
        contrastText: info["lighter"],
        light: info["light"],
        main: info["main"],
        dark: info["dark"],
      },
      warning: {
        light: warning["light"],
        main: warning["main"],
        dark: warning["dark"],
      },
      error: {
        light: error["light"],
        main: error["main"],
        dark: error["dark"],
      },
      success: {
        light: success["light"],
        main: success["main"],
        dark: success["dark"],
      },
      grey: {
        ...grey,
      },
      divider: alpha(grey[700], 0.6),
      background: {
        default: grey[900],
        paper: "hsl(220, 30%, 7%)",
      },
      text: {
        primary: "hsl(0, 0%, 100%)",
        secondary: grey[400],
      },
      action: {
        hover: alpha(grey[600], 0.2),
        selected: alpha(grey[600], 0.3),
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px",
    },
  },
};

export const shape = {
  borderRadius: 8,
};

// @ts-ignore
const defaultShadows: Shadows = [
  "none",
  "var(--template-palette-baseShadow)",
  ...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;
