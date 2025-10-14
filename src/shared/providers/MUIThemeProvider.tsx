import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/theme/mui/AppTheme";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { ThemeProvider } from "@mui/material";

const MUIThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider
      options={{
        enableCssLayer: true,
        key: "onair",
        // nonce: "668868",
        prepend: true,
      }}
    >
      <InitColorSchemeScript attribute="class" />
      <ThemeProvider
        theme={theme}
        disableTransitionOnChange
        disableNestedContext
        defaultMode="light"
      >
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};
export default MUIThemeProvider;
