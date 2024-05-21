const ROUTE_NAME = 'admin/grades';

export const gradeRoutes = [{
    path: `/${ROUTE_NAME}`,
    children: [
        {
            path: "",
            name: 'admin/grades',
            component: () => import('../../pages/Admin/Grade/GradeIndex.vue'),
        },
        {
            path: 'create',
            name: 'createGrade',
            component: () => import('../../pages/Admin/Grade/Create.vue'),
        },
        {
            path: ':id/edit',
            name: 'editGrade',
            component: () => import('../../pages/Admin/Grade/Edit.vue'),
        },
    ]
}]