export const PATHS = {
  ROOT: "/",
  DASHBOARD: "/dashboard",
  ANALYTIC: "/analytic",
  ORGANIZATION: "/organization",
  DEPARTMENTS: {
    ROOT: "/department/departments",
    CREATE_DEPARTMENT: "/department/departments/create",
    IMPORT_DEPARTMENTS: "/department/departments/import",
  },
  BRANCHES: {
    ROOT: "/department/branches",
    CREATE_BRANCH: "/department/branches/create",
    IMPORT_BRANCHES: "/department/branches/import",
  },
  EMPLOYEES: {
    ROOT: "/employees",
    EMPLOYEES_ID: (id: string = ":id") => `/employees/${id}`,
    CREATE_EMPLOYEE: "/employees/create",
    IMPORT_EMPLOYEES: "/employees/import",
  },
  ROLE: {
    ROOT: "/roles",
    ROLES_ID: (id: string = ":id") => `/roles/${id}`,
    CREATE: "/roles/create",
  },
  CLASSROOMS: {
    ROOT: "/class-room",
    CREATE_CLASSROOM_OFFLINE: "/class-room/offline/create",
    CREATE_CLASSROOM_ONLINE: "/class-room/online/create",
    CREATE_CLASSROOM: "/class-room/create",
    LIST_CLASSROOM: "/class-room/list",
    DETAIL_CLASSROOM: (slug: string) => `/class-room/detail/${slug}`,
    COUNTDOWN_CLASSROOM: (slug: string, sessionId: string) => `/class-room/cd/${slug}/${sessionId}`,
  },
  STUDENTS: {
    ROOT: "/my-class",
  },
  ASSIGNMENTS: {
    ROOT: '/assignments',
    CREATE_ASSIGNMENT: '/assignments/create',
    EDIT_ASSIGNMENT: (id: string = ':id') => `/assignments/edit/${id}`,
  },
  REPORTS: {
    ROOT: "/report",
    OVER_VIEW: "/report/overview",
  },
};
