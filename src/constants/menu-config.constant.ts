import {
  ClassIcon,
  GitIcon,
  HelpIcon,
  SquareFourIcon,
  UsersIcon,
  MonitorIcon,
  BookOpenIcon,
} from "@/shared/assets/icons";
import { MenuItemType } from "@/shared/ui/layouts/MainLayout/MenuList/type";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import React from "react";
import { PATHS } from "./path.contstants";

const MAIN_MENU_LIST: MenuItemType[] = [
  {
    title: "Dashboard",
    icon: React.createElement(SquareFourIcon),
    key: "dashboard",
    path: PATHS.DASHBOARD,
    type: "item",
  },
  {
    title: "Quản lý chi nhánh",
    icon: React.createElement(GitIcon),
    key: "branches",
    path: PATHS.BRANCHES.ROOT,
    type: "item",
    children: [
      {
        title: "Danh sách chi nhánh",
        icon: React.createElement(GitIcon),
        key: "branches-list",
        path: PATHS.BRANCHES.ROOT,
      },
    ],
  },
  {
    title: "Quản lý phòng ban",
    icon: React.createElement(UsersIcon),
    key: "departments",
    path: PATHS.DEPARTMENTS.ROOT,
    type: "item",
    children: [
      {
        title: "Danh sách phòng ban",
        icon: React.createElement(UsersIcon),
        key: "departments-list",
        path: PATHS.DEPARTMENTS.ROOT,
      },
    ],
  },
  {
    title: "Quản lý lớp học trực tuyến",
    subTitle: "(Live)",
    icon: React.createElement(MonitorIcon),
    key: "class-room-online",
    path: PATHS.CLASSROOMS.CREATE_CLASSROOM_ONLINE,
    children: [
      {
        title: "Tạo lớp học",
        icon: React.createElement(ClassIcon),
        key: "class-room-online-create",
        path: PATHS.CLASSROOMS.CREATE_CLASSROOM_ONLINE,
      },
    ],
  },
  {
    title: "Quản lý lớp học trực tiếp",
    subTitle: "(In house)",
    icon: React.createElement(BookOpenIcon),
    key: "class-room-offline",
    path: PATHS.CLASSROOMS.CREATE_CLASSROOM_OFFLINE,
    children: [
      {
        title: "Tạo lớp học",
        icon: React.createElement(ClassIcon),
        key: "class-room-offline-create",
        path: PATHS.CLASSROOMS.CREATE_CLASSROOM_OFFLINE,
      },
      {
        title: "Danh sách lớp học",
        icon: React.createElement(ClassIcon),
        key: "class-room/list",
        path: PATHS.CLASSROOMS.LIST_CLASSROOM,
      },
    ],
  },
  {
    title: "Danh sách nhân viên",
    icon: React.createElement(UsersIcon),
    key: "employees",
    path: PATHS.EMPLOYEE.ROOT,
    children: [
      {
        title: "Tạo nhân viên",
        icon: React.createElement(UsersIcon),
        key: "employees/create",
        path: PATHS.EMPLOYEE.CREATE_EMPLOYEE,
      },
      {
        title: "Import danh sách",
        icon: React.createElement(UsersIcon),
        key: "employees/import",
        path: PATHS.EMPLOYEE.IMPORT_EMPLOYEES,
      },
    ],
  },
  {
    title: "Quản lý vai trò",
    icon: React.createElement(UsersIcon),
    key: "roles",
    path: PATHS.ROLE.ROOT,
    children: [
      {
        title: "Danh sách vai trò",
        icon: React.createElement(UsersIcon),
        key: "roles",
        path: PATHS.ROLE.ROOT,
      },
      {
        title: "Tạo vai trò",
        icon: React.createElement(UsersIcon),
        key: "roles/create",
        path: PATHS.ROLE.CREATE,
      },
    ],
  },
  {
    title: "Lớp học của tôi",
    icon: React.createElement(UsersIcon),
    key: "my-class",
    path: PATHS.STUDENTS.ROOT,
    // children: [
    //   {
    //     title: "Tạo nhân viên",
    //     icon: React.createElement(UsersIcon),
    //     key: 'employees/create',
    //     path: PATHS.EMPLOYEE.CREATE_EMPLOYEE,
    //   },
    //   {
    //     title: "Import danh sách",
    //     icon: React.createElement(UsersIcon),
    //     key: 'employees/import',
    //     path: PATHS.EMPLOYEE.IMPORT_EMPLOYEES,
    //   },
    // ],
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
  // {
  //   title: "Tasks",
  //   icon: React.createElement(AssignmentRoundedIcon),
  //   key: "task",
  //   type: "group",
  //   children: [
  //     {
  //       title: "clients sub 2",
  //       icon: React.createElement(PeopleRoundedIcon),
  //       key: "clients12",
  //       path: "clients111",
  //       children: [
  //         {
  //           title: "client sub sub 1",
  //           icon: React.createElement(PeopleRoundedIcon),
  //           key: "clients11",
  //           path: "clients11122112",
  //         },
  //         {
  //           title: "clients sub sub 2",
  //           icon: React.createElement(PeopleRoundedIcon),
  //           key: "clients11",
  //           path: "clients11122332",
  //         },
  //       ],
  //     },
  //     {
  //       title: "clients sub 3",
  //       icon: React.createElement(PeopleRoundedIcon),
  //       key: "clients32",
  //       path: "clients111333",
  //     },
  //     {
  //       title: "clients sub 4",
  //       icon: React.createElement(PeopleRoundedIcon),
  //       key: "clients32",
  //       path: "clients111333444",
  //     },
  //   ],
  // },
];

export { MAIN_MENU_LIST };
