import { memo, PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MainClientWraper from "./MainWraperClient";
import SideBarContainer from "./SidebarWraper";
import HeaderWraper from "./HeaderWraper";

interface LayoutWraperProps extends PropsWithChildren {
  className?: string;
  header: React.ReactNode;
  siderBar: React.ReactNode;
  footer: React.ReactNode;
  appBar: React.ReactNode;
}
const LayoutWraper: React.FC<LayoutWraperProps> = ({
  children,
  siderBar,
  header,
  footer,
  appBar,
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      <SideBarContainer>{siderBar}</SideBarContainer>
      {appBar}
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
          {header && <HeaderWraper>{header}</HeaderWraper>}
          {children}
        </Stack>
        {footer}
      </MainClientWraper>
    </Box>
  );
};
export default memo(LayoutWraper);
