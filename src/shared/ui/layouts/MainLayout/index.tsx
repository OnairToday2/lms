import { PropsWithChildren } from "react";
import Copyright from "./Copyright";
import LayoutWraper from "./LayoutWraper";
import SelectContent from "./Sidebar/SelectContent";
import Divider from "@mui/material/Divider";
import AccountSetting from "./AccountSetting";
import Stack from "@mui/material/Stack";
import MenuButton from "./MenuButton";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ColorModeIconDropdown from "../../ColorModeIconDropdown";
import NavbarMobile from "./NavbarMobile";
import MenuContent from "./MenuContent";
import { MAIN_MENU_LIST } from "./menuConfig";
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
            <MenuContent items={MAIN_MENU_LIST} />
            {/* <CardAlert /> */}
          </div>
          <AccountSetting />
        </>
      }
      appBar={<NavbarMobile />}
      header={
        <>
          <Stack direction="row" sx={{ gap: 1 }} className="ml-auto">
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
