const ROUTE_NAME = 'admin/careers';

export const careerRoutes = [{
    path: `/${ROUTE_NAME}`,
    children: [
        {
            path: "",
            name: 'admin/careers',
            component: () => import('../../pages/Admin/Carreer/CarreerIndex.vue'),
        },
        {
            path: 'create',
            name: 'createCareer',
            component: () => import('../../pages/Admin/Carreer/Create.vue'),
        },
        {
            path: ':id/edit',
            name: 'editCareer',
            component: () => import('../../pages/Admin/Carreer/Edit.vue'),
        },
    ]
}]