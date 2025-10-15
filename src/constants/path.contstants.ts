
export const PATHS = {
    ROOT: '/',
    DASHBOARD: '/dashboard',
    ANALYTIC: '/analytic',
    ORGANIZATION: '/organization',
    DEPARTMENTS: '/departments',
    EMPLOYEES: '/employees',
    EMPLOYEES_ID: (id: string = ':id') => `/employees/${id}`,
    CREATE_EMPLOYEE: '/employees/create',
    IMPORT_EMPLOYEES: '/employees/import',
    ROLES: '/roles',
    ROLES_ID: (id: string = ':id') => `/roles/${id}`,
    CREATE_ROLE: '/roles/create',
    CLASSROOMS: '/class-room',
    CREATE_CLASSROOM: '/class-room/create',
    LIST_CLASSROOM: '/class-room/list',
}