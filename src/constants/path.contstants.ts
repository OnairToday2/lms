
export const PATHS = {
    ROOT: '/',
    DASHBOARD: '/dashboard',
    ANALYTIC: '/analytic',
    ORGANIZATION: '/organization',
    DEPARTMENTS: '/departments',
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