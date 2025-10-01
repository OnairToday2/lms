import "@mui/material/styles";

declare module "@mui/material/styles" {
  // interface PaletteOptions {
  //   fill?: Palette["primary"];
  // }
  // interface Palette {
  //   fill?: PaletteOptions["primary"];
  // }
}

declare module "@mui/material/Button" {
  // interface ButtonPropsColorOverrides {
  //   fill: true;
  // }

  interface ButtonPropsVariantOverrides {
    fill: true;
  }
}

// declare module "@mui/material/styles" {
//   interface PaletteColor {
//     darker?: string;
//   }

//   interface SimplePaletteColorOptions {
//     darker?: string;
//   }
// }
