const ROUTE_NAME = 'admin/states';

export const stateRoutes = [{
  path: `/${ROUTE_NAME}`,
  children: [
    {
      path: "",
      name: 'admin/states',
      component: () => import('../../pages/Admin/State/StateIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'create',
      name: 'createState',
      component: () => import('../../pages/Admin/State/Create.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/edit',
      name: 'editState',
      component: () => import('../../pages/Admin/State/Edit.vue'),
      meta: { roles: ['Administrador'] },
    },
  ]
}];
