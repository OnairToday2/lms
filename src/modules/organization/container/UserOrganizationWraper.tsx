import { UserOrganizationProvider } from "../store/UserOrganizationProvider";
import { getEmployeeDetailInfoByUserId } from "../actions/getOrganization";
import { ensureGetCurrentUser } from "../../auth/actions/getCurrentUser";
const UserOrganizationWraper = async ({ children }: { readonly children: React.ReactNode }) => {
  const currentUser = await ensureGetCurrentUser();
  const employeeDetail = await getEmployeeDetailInfoByUserId(currentUser.id);

  if (!employeeDetail.organizations) {
    throw new Error("Invalid Organization");
  }

  return (
    <UserOrganizationProvider
      data={{
        id: employeeDetail.id,
        status: employeeDetail.status,
        employeeCode: employeeDetail.employee_code,
        employeeType: employeeDetail.employee_type || "student",
        userId: currentUser.id,
        organization: {
          id: employeeDetail.organizations?.id,
          name: employeeDetail.organizations?.name,
          subdomain: employeeDetail.organizations?.subdomain,
        },
        profile: employeeDetail.profiles
          ? {
              fullName: employeeDetail.profiles.full_name,
              avatarUrl: employeeDetail.profiles.avatar || "",
              email: employeeDetail.profiles.email,
              gender: employeeDetail.profiles.gender,
            }
          : null,
      }}
    >
      {children}
    </UserOrganizationProvider>
  );
};
export default UserOrganizationWraper;
