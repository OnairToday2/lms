import MainLayout from "@/shared/ui/layouts/MainLayout";
import Authorized from "@/modules/authWrapper/Authorized";
import UserOrganizationWraper from "@/modules/organization/container/UserOrganizationWraper";
import PermissionsWrapper from "@/modules/roles/store/PermissionsWrapper";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Authorized>
      <UserOrganizationWraper>
        <PermissionsWrapper>
          <MainLayout>{children}</MainLayout>
        </PermissionsWrapper>
      </UserOrganizationWraper>
    </Authorized>
  );
}
