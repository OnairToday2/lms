import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import React from "react";
import { MenuItemType } from "@/shared/ui/layouts/MainLayout/MenuList/type";
import {
  SquareFourIcon,
  GitIcon,
  UsersIcon,
  HelpIcon,
} from "@/shared/assets/icons";

const MAIN_MENU_LIST: MenuItemType[] = [
  {
    title: "Dashboard",
    icon: React.createElement(SquareFourIcon),
    key: "dashboard",
    children: [],
    path: "/dashboard",
    type: "item",
  },
  {
    title: "Quản lý phòng ban",
    icon: React.createElement(GitIcon),
    key: "department",
    path: "department",
    type: "item",
  },
  {
    title: "Danh sách nhân viên",
    icon: React.createElement(UsersIcon),
    key: "employees",
    path: "employees",
    children: [
      {
        title: "Tạo nhân viên",
        icon: React.createElement(UsersIcon),
        key: "employees/create",
        path: "employees/create",
      },
      {
        title: "Import user",
        icon: React.createElement(UsersIcon),
        key: "employees/import",
        path: "employees/import",
      },
    ],
  },
  {
    title: "Trợ giúp",
    icon: React.createElement(HelpIcon),
    key: "help",
    type: "item",
    path: "help",
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
    type: "group",
    children: [
      {
        title: "clients sub 2",
        icon: React.createElement(PeopleRoundedIcon),
        key: "clients12",
        path: "clients111",
        children: [
          {
            title: "client sub sub 1",
            icon: React.createElement(PeopleRoundedIcon),
            key: "clients11",
            path: "clients11122112",
          },
          {
            title: "clients sub sub 2",
            icon: React.createElement(PeopleRoundedIcon),
            key: "clients11",
            path: "clients11122332",
          },
        ],
      },
      {
        title: "clients sub 3",
        icon: React.createElement(PeopleRoundedIcon),
        key: "clients32",
        path: "clients111333",
      },
      {
        title: "clients sub 4",
        icon: React.createElement(PeopleRoundedIcon),
        key: "clients32",
        path: "clients111333444",
      },
    ],
  },
];

export { MAIN_MENU_LIST };
