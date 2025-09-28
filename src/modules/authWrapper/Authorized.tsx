import React from "react";
import { AuthProvider } from "@/modules/auth/store/AuthProvider";
import { getCurrentUser } from "@/modules/auth/actions/getCurrentUser";
import { redirect, RedirectType } from "next/navigation";
interface Props {
  children: React.ReactNode;
}
const Authorized: React.FC<Props> = async ({ children }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth/signin", RedirectType.replace);
  }
  const userInfo = currentUser.user_metadata;

  return (
    <AuthProvider
      data={{
        id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        avatarUrl: userInfo.avatar_url,
        accessToken: userInfo.accessToken,
      }}
    >
      {children}
    </AuthProvider>
  );
};
export default Authorized;
