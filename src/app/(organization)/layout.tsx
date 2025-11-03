import MainLayout from "@/shared/ui/layouts/MainLayout";
import Authorized from "@/modules/authWrapper/Authorized";
import UserOrganizationWraper from "@/modules/organization/container/UserOrganizationWraper";
import PermissionsWrapper from "@/modules/roles/store/PermissionsWrapper";
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
          <MainLayout>
            <LibraryProvider>
              {children}
              <LibraryDialog />
            </LibraryProvider>
          </MainLayout>
        </PermissionsWrapper>
      </UserOrganizationWraper>
    </Authorized>
  );
}
