import { redirect, RedirectType } from "next/navigation";
import { getCurrentUser } from "../auth/actions/getCurrentUser";
interface UnAuthorizedProps {
  children?: React.ReactNode;
}
const UnAuthorized = async ({ children }: UnAuthorizedProps) => {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/dashboard", RedirectType.replace);
  }
  return children;
};

export default UnAuthorized;
