"use client";
import { Badge, IconButton } from "@mui/material";
import { BellIcon } from "../assets/icons";
import { useTheme, useMediaQuery, useColorScheme } from "@mui/material";

const NotifycationButton = () => {
  const theme = useTheme();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const preferredMode = prefersDarkMode ? "dark" : "light";

  const { mode } = useColorScheme();

  const paletteMode = !mode || mode === "system" ? preferredMode : mode;

  return (
    <IconButton
      sx={{
        backgroundColor: paletteMode === "light" ? "white" : "white",
      }}
    >
      <Badge
        badgeContent={4}
        variant="dot"
        color="secondary"
        sx={{
          "& .MuiBadge-dot": {
            marginTop: "4px",
            marginRight: "4px",
            borderRadius: 50,
          },
        }}
      >
        <BellIcon />
      </Badge>
    </IconButton>
  );
};
export default NotifycationButton;
