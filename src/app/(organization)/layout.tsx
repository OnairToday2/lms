import MainLayout from "@/shared/ui/layouts/MainLayout";
import Authorized from "@/modules/authWrapper/Authorized";
import UserOrganizationWraper from "@/modules/organization/container/UserOrganizationWraper";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Authorized>
      <UserOrganizationWraper>
        <MainLayout>{children}</MainLayout>
      </UserOrganizationWraper>
    </Authorized>
  );
}
