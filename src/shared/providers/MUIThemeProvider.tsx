import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "@/theme/mui/AppTheme";

const MUIThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true, key: "onair" }}>
      <AppTheme themeComponents={undefined}>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <CssBaseline />
        {children}
      </AppTheme>
    </AppRouterCacheProvider>
  );
};
export default MUIThemeProvider;
