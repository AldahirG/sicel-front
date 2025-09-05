const ROUTE_NAME = 'admin/enrollments/lists';

export const listRoutes = [
  {
    path: `/${ROUTE_NAME}`,
    children: [
      {
        path: '',
        name: 'admin/enrollments/lists',
        component: () => import('../../../pages/Admin/List/ListIndex.vue'),
        meta: { roles: ['Administrador'] },
      },
      {
        path: 'create',
        name: 'createList',
        component: () => import('../../../pages/Admin/List/Create.vue'),
        meta: { roles: ['Administrador'] },
      },
      {
        path: ':id/edit',
        name: 'editList',
        component: () => import('../../../pages/Admin/List/Edit.vue'),
        meta: { roles: ['Administrador'] },
      },
    ]
  }
];
