import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { PropsWithChildren } from "react";
import SideBar from "./Sidebar";
import Header from "./Header";
import MainClientWraper from "./MainWraperClient";
import Copyright from "./Copyright";
import NavbarMobile from "./NavbarMobile";

interface MainLayoutProps extends PropsWithChildren {}
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <NavbarMobile />
      {/* Main content */}
      <MainClientWraper>
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header />
          {children}
        </Stack>
        <Copyright />
      </MainClientWraper>
    </Box>
  );
};
export default MainLayout;
