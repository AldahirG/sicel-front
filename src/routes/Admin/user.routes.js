const ROUTE_NAME = 'admin/users';

export const userRoutes = [{
  path: `/${ROUTE_NAME}`,
  children: [
    {
      path: "",
      name: 'admin/users',
      component: () => import('../../pages/Admin/User/UserIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'create',
      name: 'createUser',
      component: () => import('../../pages/Admin/User/Create.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/edit',
      name: 'editUser',
      component: () => import('../../pages/Admin/User/Edit.vue'),
      meta: { roles: ['Administrador'] },
    },
  ]
}];
