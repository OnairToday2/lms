"use client";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import { PropsWithChildren } from "react";
interface MainClientWraperProps extends PropsWithChildren {}
const MainClientWraper: React.FC<MainClientWraperProps> = ({ children }) => {
  return (
    <Box
      component="main"
      sx={(theme) => ({
        flexGrow: 1,
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
          : alpha(theme.palette.background.default, 1),
      })}
    >
      {children}
    </Box>
  );
};
export default MainClientWraper;
