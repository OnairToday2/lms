import Authorized from "@/modules/auth-wrapper/Authorized";
import UserOrganizationWraper from "@/modules/organization/container/UserOrganizationWraper";
import PermissionsWrapper from "@/modules/roles/store/PermissionsWrapper";
import LayoutWraper from "@/modules/layout-wraper/LayoutWraper";
import { LibraryProvider } from "@/modules/library/store/libraryProvider";
import { LibraryDialog } from "@/modules/library/components/LibraryDialog";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Authorized>
      <UserOrganizationWraper>
        <PermissionsWrapper>
          <LayoutWraper>
            <LibraryProvider>
              {children}
              <LibraryDialog />
            </LibraryProvider>
          </LayoutWraper>
        </PermissionsWrapper>
      </UserOrganizationWraper>
    </Authorized>
  );
}
