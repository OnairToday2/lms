"use client";
import { PropsWithChildren, useCallback, useRef, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
interface MainLayoutProps extends PropsWithChildren {
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
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
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          flex: 1,
          background: "#F5F8FF",
          overflow: "auto",
          ...theme.applyStyles("dark", {
            background: "rgb(5 7 10)",
          }),
        })}
      >
        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            px: { xs: 4, md: 6, xl: 8 },
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
