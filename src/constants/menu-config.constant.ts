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
    title: "Quản lý chi nhánh",
    icon: React.createElement(GitIcon),
    key: "branches",
    path: "branches",
    type: "item",
    children: [
      {
        title: "Danh sách chi nhánh",
        icon: React.createElement(GitIcon),
        key: "branches-list",
        path: "/department/branches",
      },
      {
        title: "Tạo chi nhánh",
        icon: React.createElement(GitIcon),
        key: "create-branch",
        path: "/department/branches/create",
      },
      {
        title: "Import chi nhánh",
        icon: React.createElement(GitIcon),
        key: "import-branch",
        path: "/department/branches/import",
      },
    ],
  },
  {
    title: "Quản lý phòng ban",
    icon: React.createElement(UsersIcon),
    key: "departments",
    path: "departments",
    type: "item",
    children: [
      {
        title: "Danh sách phòng ban",
        icon: React.createElement(UsersIcon),
        key: "departments-list",
        path: "/department/departments",
      },
      {
        title: "Tạo phòng ban",
        icon: React.createElement(UsersIcon),
        key: "create-department",
        path: "/department/departments/create",
      },
      {
        title: "Import phòng ban",
        icon: React.createElement(UsersIcon),
        key: "import-department",
        path: "/department/departments/import",
      },
    ],
  },
  {
    title: "Danh sách nhân viên",
    icon: React.createElement(UsersIcon),
    key: "employee",
    path: "employee",
    children: [
      {
        title: "Tạo nhân vien",
        icon: React.createElement(UsersIcon),
        key: "employee",
        path: "employee",
      },
      {
        title: "Import danh sách",
        icon: React.createElement(UsersIcon),
        key: "employee",
        path: "employee",
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
