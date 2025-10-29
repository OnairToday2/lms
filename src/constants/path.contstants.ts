
export const PATHS = {
    ROOT: '/',
    DASHBOARD: '/dashboard',
    ANALYTIC: '/analytic',
    ORGANIZATION: '/organization',
    DEPARTMENTS: {
        ROOT: '/department/departments',
        CREATE_DEPARTMENT: '/department/departments/create',
        IMPORT_DEPARTMENTS: '/department/departments/import',
    },
    BRANCHES: {
        ROOT: '/department/branches',
        CREATE_BRANCH: '/department/branches/create',
        IMPORT_BRANCHES: '/department/branches/import',
    },
    EMPLOYEE: {
        ROOT: '/employees',
        EMPLOYEES_ID: (id: string = ':id') => `/employees/${id}`,
        CREATE_EMPLOYEE: '/employees/create',
        IMPORT_EMPLOYEES: '/employees/import',
    },
    ROLE: {
        ROOT: '/roles',
        ROLES_ID: (id: string = ':id') => `/roles/${id}`,
        CREATE_ROLE: '/roles/create',
    },
    CLASSROOMS: {
        ROOT: '/class-room',
        CREATE_CLASSROOM: '/class-room/create',
    }
}