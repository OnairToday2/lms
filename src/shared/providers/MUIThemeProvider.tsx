import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "@/theme/mui/AppTheme";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

const MUIThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider
      options={{
        enableCssLayer: true,
        key: "onair",
        nonce: "668868",
        prepend: true,
      }}
    >
      <InitColorSchemeScript attribute="class" />
      <AppTheme>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <CssBaseline enableColorScheme />
        {children}
      </AppTheme>
    </AppRouterCacheProvider>
  );
};
export default MUIThemeProvider;
