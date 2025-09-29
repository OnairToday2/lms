import { createTheme, alpha, PaletteMode, Shadows } from "@mui/material/styles";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}
declare module "@mui/material/styles" {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  }

  interface PaletteColor extends ColorRange {}

  interface Palette {
    baseShadow: string;
  }
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

export const brand = {
  50: "hsl(221, 96%, 97%)",
  100: "hsl(221, 96%, 93%)",
  200: "hsl(221, 100%, 87%)",
  300: "hsl(221, 100%, 78%)",
  400: "hsl(221, 100%, 66%)",
  500: "hsl(221, 100%, 58%)",
  600: "hsl(221, 97%, 54%)",
  700: "hsl(221, 84%, 49%)",
  800: "hsl(221, 76%, 41%)",
  900: "hsl(221, 67%, 33%)",
  950: "hsl(221, 59%, 21%)",
};

export const gray = {
  50: "hsl(210,24%,98%)",
  100: "hsl(220, 15%, 96%)",
  200: "hsl(220, 14%, 91%)",
  300: "hsl(216, 13%, 84%)",
  400: "hsl(217, 12%, 64%)",
  500: "hsl(220, 10%, 46%)",
  600: "hsl(214, 16%, 34%)",
  700: "hsl(216, 21%, 27%)",
  800: "hsl(215, 31%, 17%)",
  900: "hsl(221, 42%, 11%)",
  950: "hsl(224, 72%, 4%)",
};

export const green = {
  50: "hsl(138.46, 77%, 97%)",
  100: "hsl(140.65, 84%, 92%)",
  200: "hsl(141.14, 81%, 85%)",
  300: "hsl(142.66, 81%, 71%)",
  400: "hsl(150.06, 96%, 45%)",
  500: "hsl(144.07, 100%, 39%)",
  600: "hsl(142.31, 100%, 33%)",
  700: "hsl(144.7, 100%, 26%)",
  800: "hsl(147.72, 97%, 20%)",
  900: "hsl(145.73, 73%, 19%)",
  950: "hsl(145.39, 88%, 10%)",
};

export const orange = {
  50: "hsl(33.7, 100%, 96%)",
  100: "hsl(34.49 ,100%, 92%)",
  200: "hsl(32.21 ,100%, 83%)",
  300: "hsl(31.56 ,100%, 71%)",
  400: "hsl(31.79 ,100%, 51%)",
  500: "hsl(24.65 ,100%, 50%)",
  600: "hsl(18.01 ,100%, 48%)",
  700: "hsl(15.73 ,100%, 40%)",
  800: "hsl(16.99 ,100%, 31%)",
  900: "hsl(15.99, 83%, 27%)",
  950: "hsl(12.88, 85%, 14%)",
};

export const red = {
  50: "hsl(360, 88%, 97%)",
  100: "hsl(359.98, 99%, 94%)",
  200: "hsl(359.95 ,100%, 90%)",
  300: "hsl(359.72 ,100%, 82%)",
  400: "hsl(358.75 ,100%, 70%)",
  500: "hsl(356.95, 96%, 58%)",
  600: "hsl(357.18 ,100%, 45%)",
  700: "hsl(357.7 ,100%, 38%)",
  800: "hsl(355.94, 91%, 33%)",
  900: "hsl(358.8, 69%, 30%)",
  950: "hsl(359.29, 79%, 15%)",
};

export const purple = {
  50: "hsl(270, 99%, 98%)",
  100: "hsl(268.7 ,100%, 95%)",
  200: "hsl(269.43 ,100%, 92%)",
  300: "hsl(271.08 ,100%, 85%)",
  400: "hsl(272.26 ,100%, 74%)",
  500: "hsl(273.3 ,100%, 64%)",
  600: "hsl(274.91, 96%, 52%)",
  700: "hsl(275.69 ,100%, 43%)",
  800: "hsl(274.93, 82%, 38%)",
  900: "hsl(274.52, 72%, 32%)",
  950: "hsl(274.32, 94%, 21%)",
};

export const yellow = {
  50: "hsl(54.55, 91%, 95%)",
  100: "hsl(54.89, 98%, 88%)",
  200: "hsl(52.74, 99%, 76%)",
  300: "hsl(51.5, 100%, 56%)",
  400: "hsl(47.61, 100%, 49%)",
  500: "hsl(44.37, 100%, 47%)",
  600: "hsl(38.88, 100%, 41%)",
  700: "hsl(34.4, 100%, 33%)",
  800: "hsl(32.78, 100%, 27%)",
  900: "hsl(29.52, 83%, 25%)",
  950: "hsl(26.16, 88%, 14%)",
};

export const blue = {
  50: "hsl(213.75, 96%, 97%)",
  100: "hsl(214.28, 96%, 93%)",
  200: "hsl(213.28 ,100%, 87%)",
  300: "hsl(210.7, 100%, 78%)",
  400: "hsl(211.97 ,100%, 66%)",
  500: "hsl(216.26 ,100%, 58%)",
  600: "hsl(221.34, 97%, 54%)",
  700: "hsl(225.35, 84%, 49%)",
  800: "hsl(227.1, 76%, 41%)",
  900: "hsl(224.86, 67%, 33%)",
  950: "hsl(226.51, 59%, 21%)",
};

export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] =
    mode === "dark"
      ? "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px"
      : "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px";

  return {
    palette: {
      mode,
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[700],
        contrastText: brand[50],
        ...(mode === "dark" && {
          contrastText: brand[50],
          light: brand[300],
          main: brand[400],
          dark: brand[700],
        }),
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
        ...(mode === "dark" && {
          contrastText: brand[300],
          light: brand[500],
          main: brand[700],
          dark: brand[900],
        }),
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
        ...(mode === "dark" && {
          light: orange[400],
          main: orange[500],
          dark: orange[700],
        }),
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
        ...(mode === "dark" && {
          light: red[400],
          main: red[500],
          dark: red[700],
        }),
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
        ...(mode === "dark" && {
          light: green[400],
          main: green[500],
          dark: green[700],
        }),
      },
      grey: {
        ...gray,
      },
      divider: mode === "dark" ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      background: {
        default: "hsl(0, 0%, 99%)",
        paper: "hsl(220, 35%, 97%)",
        ...(mode === "dark" && {
          default: gray[900],
          paper: "hsl(220, 30%, 7%)",
        }),
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
        ...(mode === "dark" && {
          primary: "hsl(0, 0%, 100%)",
          secondary: gray[400],
        }),
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
        ...(mode === "dark" && {
          hover: alpha(gray[600], 0.2),
          selected: alpha(gray[600], 0.3),
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
        light: brand[200],
        main: brand[400],
        dark: brand[700],
        contrastText: brand[50],
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: "hsl(0, 0%, 99%)",
        paper: "hsl(220, 35%, 97%)",
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: brand[50],
        light: brand[300],
        main: brand[400],
        dark: brand[700],
      },
      info: {
        contrastText: brand[300],
        light: brand[500],
        main: brand[700],
        dark: brand[900],
      },
      warning: {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
      },
      error: {
        light: red[400],
        main: red[500],
        dark: red[700],
      },
      success: {
        light: green[400],
        main: green[500],
        dark: green[700],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[700], 0.6),
      background: {
        default: gray[900],
        paper: "hsl(220, 30%, 7%)",
      },
      text: {
        primary: "hsl(0, 0%, 100%)",
        secondary: gray[400],
      },
      action: {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px",
    },
  },
};

export const typography = {
  fontFamily: "Inter, sans-serif",
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
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
