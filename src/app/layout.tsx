import type { Metadata } from "next";
import ReactQueryClientProvider from "@/shared/providers/ReactQueryClientProvider";
import MUIThemeProvider from "@/shared/providers/MUIThemeProvider";
import NotificationsProvider from "@/hooks/useNotifications/NotificationsProvider";
import MUILocalizationProvider from "@/shared/providers/MUILocationProvider";
import DialogsProvider from "@/hooks/useDialogs/DialogsProvider";
import { Inter } from "next/font/google";
import "../theme/palette.css";
import "../theme/globals.css";
import ToastSnackbar from "@/shared/store/toast-snackbar/ToastSnackbar";
import { ToastSnackbarProvider } from "@/shared/store/toast-snackbar/toast-snackbar-context";

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
          <MUIThemeProvider>
            <MUILocalizationProvider>
              <NotificationsProvider>
                <DialogsProvider>
                  <ToastSnackbarProvider>
                    {children}
                    <ToastSnackbar />
                  </ToastSnackbarProvider>
                </DialogsProvider>
              </NotificationsProvider>
            </MUILocalizationProvider>
          </MUIThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
