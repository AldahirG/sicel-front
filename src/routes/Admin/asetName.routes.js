const ROUTE_NAME = 'admin/aset-names';

export const asetNameRoutes = [{
  path: `/${ROUTE_NAME}`,
  children: [
    {
      path: "",
      name: 'admin/aset-names',
      component: () => import('../../pages/Admin/AsetName/AsetNameIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'create',
      name: 'createAsetName',
      component: () => import('../../pages/Admin/AsetName/Create.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/edit',
      name: 'editAsetName',
      component: () => import('../../pages/Admin/AsetName/Edit.vue'),
      meta: { roles: ['Administrador'] },
    },
  ]
}];
