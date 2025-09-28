import MainLayout from "@/shared/ui/layouts/MainLayout";
import Authorized from "@/modules/authWrapper/Authorized";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Authorized>
      <MainLayout>{children}</MainLayout>
    </Authorized>
  );
}
