"use client";
import { IconButton } from "@mui/material";
import { SettingIcon } from "../assets/icons";
import { useTheme, useMediaQuery, useColorScheme } from "@mui/material";
const SettingButton = () => {
  const theme = useTheme();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const preferredMode = prefersDarkMode ? "dark" : "light";

  const { mode } = useColorScheme();

  const paletteMode = !mode || mode === "system" ? preferredMode : mode;

  return (
    <IconButton
      sx={(theme) => ({
        backgroundColor: paletteMode === "dark" ? "white" : "white",
      })}
    >
      <SettingIcon />
    </IconButton>
  );
};
export default SettingButton;
