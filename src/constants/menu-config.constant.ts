import { ClassIcon, GitIcon, HelpIcon, SquareFourIcon, UsersIcon } from "@/shared/assets/icons";
import { MenuItemType } from "@/shared/ui/layouts/MainLayout/MenuList/type";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import React from "react";
import { PATHS } from "./path.contstants";

const MAIN_MENU_LIST: MenuItemType[] = [
  {
    title: "Dashboard",
    icon: React.createElement(SquareFourIcon),
    key: 'dashboard',
    path: PATHS.DASHBOARD,
    type: "item",
  },
  {
    title: "Quản lý chi nhánh",
    icon: React.createElement(GitIcon),
    key: "branches",
    path: PATHS.BRANCHES,
    type: "item",
    children: [
      {
        title: "Danh sách chi nhánh",
        icon: React.createElement(GitIcon),
        key: "branches-list",
        path: PATHS.LIST_BRANCHES,
      },
      {
        title: "Tạo chi nhánh",
        icon: React.createElement(GitIcon),
        key: "create-branch",
        path: PATHS.CREATE_BRANCH,
      },
      {
        title: "Import chi nhánh",
        icon: React.createElement(GitIcon),
        key: "import-branch",
        path: PATHS.IMPORT_BRANCHES,
      },
    ],
  },
  {
    title: "Quản lý phòng ban",
    icon: React.createElement(UsersIcon),
    key: "departments",
    path: PATHS.DEPARTMENTS,
    type: "item",
    children: [
      {
        title: "Danh sách phòng ban",
        icon: React.createElement(UsersIcon),
        key: "departments-list",
        path: PATHS.LIST_DEPARTMENTS,
      },
      {
        title: "Tạo phòng ban",
        icon: React.createElement(UsersIcon),
        key: "create-department",
        path: PATHS.CREATE_DEPARTMENT,
      },
      {
        title: "Import phòng ban",
        icon: React.createElement(UsersIcon),
        key: "import-department",
        path: PATHS.IMPORT_DEPARTMENTS,
      },
    ],
  },
  {
    title: "Quản lý lớp học",
    icon: React.createElement(ClassIcon),
    key: "class-room",
    path: PATHS.CLASSROOMS,
    children: [
      {
        title: "Tạo lớp học",
        icon: React.createElement(ClassIcon),
        key: "class-room/create",
        path: PATHS.CREATE_CLASSROOM,
      },
    ],
  },
  {
    title: "Danh sách nhân viên",
    icon: React.createElement(UsersIcon),
    key: "employees",
    path: PATHS.EMPLOYEES,
    children: [
      {
        title: "Tạo nhân vien",
        icon: React.createElement(UsersIcon),
        key: 'employees/create',
        path: PATHS.CREATE_EMPLOYEE,
      },
      {
        title: "Import danh sách",
        icon: React.createElement(UsersIcon),
        key: 'employees/import',
        path: PATHS.IMPORT_EMPLOYEES,
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
