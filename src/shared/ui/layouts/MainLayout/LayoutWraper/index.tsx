"use client";
import { memo, PropsWithChildren, useCallback, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MainClientWraper from "./MainWraperClient";
import SideBarContainer from "./SidebarWraper";
import DashboardSidebar from "../Sidebar";
import { Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

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
  const theme = useTheme();
  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] =
    useState(true);
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] =
    useState(false);

  const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

  const isNavigationExpanded = isOverMdViewport
    ? isDesktopNavigationExpanded
    : isMobileNavigationExpanded;

  const setIsNavigationExpanded = useCallback(
    (newExpanded: boolean) => {
      if (isOverMdViewport) {
        setIsDesktopNavigationExpanded(newExpanded);
      } else {
        setIsMobileNavigationExpanded(newExpanded);
      }
    },
    [
      isOverMdViewport,
      setIsDesktopNavigationExpanded,
      setIsMobileNavigationExpanded,
    ],
  );

  const handleToggleHeaderMenu = useCallback(
    (isExpanded: boolean) => {
      setIsNavigationExpanded(isExpanded);
    },
    [setIsNavigationExpanded],
  );

  const layoutRef = useRef<HTMLDivElement>(null);
  return (
    <Box
      ref={layoutRef}
      component="div"
      className="main-layout"
      sx={{ display: "flex" }}
    >
      <SideBarContainer>{siderBar}</SideBarContainer>
      {/* <DashboardSidebar
        expanded={isNavigationExpanded}
        setExpanded={setIsNavigationExpanded}
        container={layoutRef.current ?? undefined}
      /> */}
      {/* {appBar} */}
      {/* Main content */}
      <MainClientWraper>
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            mx: 6,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Stack
            direction="row"
            sx={{
              // display: { xs: "none", md: "flex" },
              width: "100%",
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              pt: 1.5,
            }}
            spacing={2}
          >
            {header}
          </Stack>
          {children}
        </Stack>
        {footer}
      </MainClientWraper>
    </Box>
  );
};
export default memo(LayoutWraper);
