import type { Metadata } from "next";
import ReactQueryClientProvider from "@/shared/providers/ReactQueryClientProvider";
import MUIThemeProvider from "@/shared/providers/MUIThemeProvider";
import NotificationsProvider from "@/hooks/useNotifications/NotificationsProvider";
import MUILocalizationProvider from "@/shared/providers/MUILocationProvider";
import DialogsProvider from "@/hooks/useDialogs/DialogsProvider";
import { Inter } from "next/font/google";
import "../theme/palette.css";
import "../theme/globals.css";
import SnackbarProvider from "@/shared/providers/SnackbarProvider";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | ONAIR",
    default: "ONAIR", // a default is required when creating a template
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="vi" suppressHydrationWarning className={inter.variable}>
        <body>
          <div className="main-app">
            <MUIThemeProvider>
              <MUILocalizationProvider>
                <NotificationsProvider>
                  <DialogsProvider>
                    <SnackbarProvider>{children}</SnackbarProvider>
                  </DialogsProvider>
                </NotificationsProvider>
              </MUILocalizationProvider>
            </MUIThemeProvider>
          </div>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
