import type { Metadata } from "next";
import MainLayout from "@/shared/ui/layouts/MainLayout";

export const metadata: Metadata = {
  title: "LMS APP - ONAIR",
  description: "LMS APP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
