import type { Metadata } from "next";
import ReactQueryClientProvider from "@/shared/providers/ReactQueryClientProvider";
import MUIThemeProvider from "@/shared/providers/MUIThemeProvider";
import "../theme/globals.css";
import NotificationsProvider from "@/hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "@/hooks/useDialogs/DialogsProvider";
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
      <html lang="vi" suppressHydrationWarning>
        <body>
          <MUIThemeProvider>
            <NotificationsProvider>
              <DialogsProvider>{children}</DialogsProvider>
            </NotificationsProvider>
          </MUIThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
