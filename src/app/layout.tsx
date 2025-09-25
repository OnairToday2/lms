import type { Metadata } from "next";
import ReactQueryClientProvider from "@/shared/providers/ReactQueryClientProvider";
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
        <body>{children}</body>
      </html>
    </ReactQueryClientProvider>
  );
}
