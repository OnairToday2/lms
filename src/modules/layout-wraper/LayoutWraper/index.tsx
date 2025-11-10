"use client";
import MainLayout from "@/shared/ui/layouts/MainLayout";
import { ADMIN_MENU_LIST, STUDENTS_MENU_LIST } from "@/constants/menu-config.constant";
import { useUserOrganization } from "@/modules/organization/store/UserOrganizationProvider";

interface LayoutWraperProps {
  children: React.ReactNode;
}
const LayoutWraper: React.FC<LayoutWraperProps> = ({ children }) => {
  //   const user = useAuthStore((state) => state);
  const { data } = useUserOrganization((state) => state);

  const menuList = data.employeeType === "student" ? STUDENTS_MENU_LIST : ADMIN_MENU_LIST;
  return <MainLayout menuItems={menuList}>{children}</MainLayout>;
};
export default LayoutWraper;
