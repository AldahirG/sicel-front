const ROUTE_NAME = 'admin/cycles';

export const cycleRoutes = [{
  path: `/${ROUTE_NAME}`,
  children: [
    {
      path: "",
      name: 'admin/cycles',
      component: () => import('../../pages/Admin/Cycle/CycleIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'create',
      name: 'createCycle',
      component: () => import('../../pages/Admin/Cycle/Create.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/edit',
      name: 'editCycle',
      component: () => import('../../pages/Admin/Cycle/Edit.vue'),
      meta: { roles: ['Administrador'] },
    },
  ]
}];
