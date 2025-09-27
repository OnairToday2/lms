import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";

export type MenuItemType = {
  title: string;
  icon: React.ReactNode;
  path: string;
  key: string;
  children?: MenuItemType[];
};
const MAIN_MENU_LIST: MenuItemType[] = [
  {
    title: "Dashboard",
    icon: <HomeRoundedIcon />,
    key: "dashboard",
    children: [],
    path: "/dashboard",
  },
  {
    title: "Analytics",
    icon: <AnalyticsRoundedIcon />,
    key: "analytics",
    children: [],
    path: "analytic",
  },
  {
    title: "Clients",
    icon: <PeopleRoundedIcon />,
    key: "clients",
    path: "clients",
    children: [
      {
        title: "clients sub 1",
        icon: <PeopleRoundedIcon />,
        key: "clients",
        path: "/",
        children: [
          {
            title: "clients sub 2",
            icon: <PeopleRoundedIcon />,
            key: "clients",
            path: "clients",
          },
          {
            title: "clients sub 2",
            icon: <PeopleRoundedIcon />,
            key: "clients",
            path: "clients",
          },
        ],
      },
      {
        title: "clients sub 1",
        icon: <PeopleRoundedIcon />,
        key: "clients",
        path: "clients",
      },
    ],
  },
  {
    title: "Tasks",
    icon: <AssignmentRoundedIcon />,
    key: "task",
    children: [],
    path: "/",
  },
];

const SECONDARY_MENU_LIST = [
  { title: "Settings", icon: <SettingsRoundedIcon /> },
  { title: "About", icon: <InfoRoundedIcon /> },
  { title: "Feedback", icon: <HelpRoundedIcon /> },
];

export { MAIN_MENU_LIST, SECONDARY_MENU_LIST };
