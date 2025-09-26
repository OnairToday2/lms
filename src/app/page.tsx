import * as React from "react";
import Box from "@mui/material/Box";
import Header from "@/shared/ui/layouts/MainLayout/Header";
import MainGrid from "@/app/_components/MainGrid";

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <Box component="div">
      <Header />
      <MainGrid />
    </Box>
  );
}
