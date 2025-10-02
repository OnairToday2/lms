import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import React from "react";

// id: string;
// title: string;
// icon?: React.ReactNode;
// href: string;
// action?: React.ReactNode;
// defaultExpanded?: boolean;
// expanded?: boolean;
// selected?: boolean;
// disabled?: boolean;
// nestedNavigation?: React.ReactNode;

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
    icon: React.createElement(HomeRoundedIcon),
    key: "dashboard",
    children: [],
    path: "/dashboard",
  },
  {
    title: "Analytics",
    icon: React.createElement(AnalyticsRoundedIcon),
    key: "analytics",
    children: [],
    path: "analytic",
  },
  {
    title: "Employees",
    icon: React.createElement(PeopleRoundedIcon),
    key: "employee",
    path: "employees",
  },
  {
    title: "Help",
    icon: React.createElement(HelpRoundedIcon),
    key: "clients",
    path: "customer",
    children: [
      {
        title: "clients sub 1",
        icon: React.createElement(PeopleRoundedIcon),
        key: "clients",
        path: "/",
        children: [
          {
            title: "clients sub 2 clients clients clients",
            icon: React.createElement(PeopleRoundedIcon),
            key: "clients",
            path: "clients",
          },
          {
            title: "clients sub 2",
            icon: React.createElement(PeopleRoundedIcon),
            key: "clients",
            path: "clients",
          },
        ],
      },
      {
        title: "clients sub 1",
        icon: React.createElement(PeopleRoundedIcon),
        key: "clients",
        path: "clients",
      },
    ],
  },
  {
    title: "Tasks",
    icon: React.createElement(AssignmentRoundedIcon),
    key: "task",
    children: [],
    path: "/",
  },
];

// const SECONDARY_MENU_LIST = [
//   { title: "Settings", icon: <SettingsRoundedIcon /> },
//   { title: "About", icon: <InfoRoundedIcon /> },
//   { title: "Feedback", icon: <HelpRoundedIcon /> },
// ];

export { MAIN_MENU_LIST };
