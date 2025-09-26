import type { Metadata } from "next";
import ReactQueryClientProvider from "@/shared/providers/ReactQueryClientProvider";
import MUIThemeProvider from "@/shared/providers/MUIThemeProvider";
import MainLayout from "@/shared/ui/layouts/MainLayout";
import "../theme/globals.css";

export const metadata: Metadata = {
  title: "LMS APP",
  description: "LMS APP",
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
            <MainLayout>{children}</MainLayout>
          </MUIThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
