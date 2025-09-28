import UnAuthorized from "@/modules/authWrapper/UnAuthorized";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <UnAuthorized>{children}</UnAuthorized>;
};
export default AuthLayout;
