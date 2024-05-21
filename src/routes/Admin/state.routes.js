const ROUTE_NAME = 'admin/states';

export const stateRoutes = [{
    path: `/${ROUTE_NAME}`,
    children: [
        {
            path: "",
            name: 'admin/states',
            component: () => import('../../pages/Admin/State/StateIndex.vue'),
        },
        {
            path: 'create',
            name: 'createState',
            component: () => import('../../pages/Admin/State/Create.vue'),
        },
        {
            path: ':id/edit',
            name: 'editState',
            component: () => import('../../pages/Admin/State/Edit.vue'),
        },
    ]
}]