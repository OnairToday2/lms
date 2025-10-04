"use client";
import { PropsWithChildren, useCallback, useRef, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
interface MainLayoutProps extends PropsWithChildren {}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] =
    useState(true);
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] =
    useState(false);

  const isOverLGViewport = useMediaQuery(theme.breakpoints.up("lg"));

  const isNavigationExpanded = isOverLGViewport
    ? isDesktopNavigationExpanded
    : isMobileNavigationExpanded;

  const setIsNavigationExpanded = useCallback(
    (newExpanded: boolean) => {
      if (isOverLGViewport) {
        setIsDesktopNavigationExpanded(newExpanded);
      } else {
        setIsMobileNavigationExpanded(newExpanded);
      }
    },
    [
      isOverLGViewport,
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
      sx={{
        position: "relative",
        display: "flex",
        overflow: "hidden",
        height: "100dvh",
      }}
    >
      <Sidebar
        expanded={isNavigationExpanded}
        setExpanded={setIsNavigationExpanded}
        container={layoutRef.current ?? undefined}
      />
      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          background: "#F5F8FF",
          overflow: "auto",
        }}
      >
        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            px: { xs: 6, md: 8, lg: 12 },
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};
export default MainLayout;
