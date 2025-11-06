import Authorized from "@/modules/authWrapper/Authorized";
import UserOrganizationWraper from "@/modules/organization/container/UserOrganizationWraper";
import PermissionsWrapper from "@/modules/roles/store/PermissionsWrapper";
import LayoutWraper from "@/modules/layout-wraper/LayoutWraper";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Authorized>
      <UserOrganizationWraper>
        <PermissionsWrapper>
          <LayoutWraper>{children}</LayoutWraper>
        </PermissionsWrapper>
      </UserOrganizationWraper>
    </Authorized>
  );
}
