import type { Metadata } from "next";
import ReactQueryClientProvider from "@/shared/providers/ReactQueryClientProvider";
import MUIThemeProvider from "@/shared/providers/MUIThemeProvider";
import "../theme/globals.css";

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
          <MUIThemeProvider>{children}</MUIThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
