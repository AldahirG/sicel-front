const ROUTE_NAME = 'admin/cities';

export const cityRoutes = [{
  path: `/${ROUTE_NAME}`,
  children: [
    {
      path: "",
      name: 'admin/cities',
      component: () => import('../../pages/Admin/City/CityIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'create',
      name: 'createCity',
      component: () => import('../../pages/Admin/City/Create.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/edit',
      name: 'editCity',
      component: () => import('../../pages/Admin/City/Edit.vue'),
      meta: { roles: ['Administrador'] },
    },
  ]
}];
