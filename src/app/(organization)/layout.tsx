import MainLayout from "@/shared/ui/layouts/MainLayout";
import Authorized from "@/modules/authWrapper/Authorized";
import { LibraryProvider } from "@/modules/library/store/libraryProvider";
import { LibraryDialog } from "@/modules/library/components/LibraryDialog";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Authorized>
      <MainLayout>
        <LibraryProvider>
          {children}
          <LibraryDialog />
        </LibraryProvider>
      </MainLayout>
    </Authorized>
  );
}
