import { PropsWithChildren } from "react";
import Copyright from "./Copyright";
import LayoutWraper from "./LayoutWraper";
import SelectContent from "./Sidebar/SelectContent";
import Divider from "@mui/material/Divider";
import CardAlert from "../../CardAlert";
import AccountSetting from "./AccountSetting";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import Stack from "@mui/material/Stack";
import MenuButton from "./MenuButton";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ColorModeIconDropdown from "../../ColorModeIconDropdown";
import NavbarMobile from "./NavbarMobile";
import MenuContent from "./MenuContent";

interface MainLayoutProps extends PropsWithChildren {}
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutWraper
      siderBar={
        <>
          <div className="flex mt-2 p-3">
            <SelectContent />
          </div>
          <Divider />
          <div className="flex flex-col flex-1">
            <MenuContent />
            <CardAlert />
          </div>
          <AccountSetting />
        </>
      }
      appBar={<NavbarMobile />}
      header={
        <>
          <NavbarBreadcrumbs />
          <Stack direction="row" sx={{ gap: 1 }}>
            {/* <Search /> */}
            <MenuButton showBadge aria-label="Open notifications">
              <NotificationsRoundedIcon />
            </MenuButton>
            <ColorModeIconDropdown />
          </Stack>
        </>
      }
      footer={<Copyright />}
    >
      {children}
    </LayoutWraper>
  );
};
export default MainLayout;
