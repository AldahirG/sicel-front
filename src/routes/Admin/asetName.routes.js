const ROUTE_NAME = 'admin/aset-names';

export const asetNameRoutes = [{
    path: `/${ROUTE_NAME}`,
    children: [
        {
            path: "",
            name: 'admin/aset-names',
            component: () => import('../../pages/Admin/AsetName/AsetNameIndex.vue'),
        },
        {
            path: 'create',
            name: 'createAsetName',
            component: () => import('../../pages/Admin/AsetName/Create.vue'),
        },
        {
            path: ':id/edit',
            name: 'editAsetName',
            component: () => import('../../pages/Admin/AsetName/Edit.vue'),
        },
    ]
}]