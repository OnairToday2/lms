import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    custom?: Palette["primary"];
  }
  interface Palette {
    custom?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    custom: true;
  }
}

declare module "@mui/material/styles" {
  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }
}
