const ROUTE_NAME = 'admin/enrollments/lists';

export const listRoutes = [
  {
    path: `/${ROUTE_NAME}`,
    children: [
      {
        path: '',
        name: 'admin/enrollments/lists',
        component: () => import('../../../pages/Admin/List/ListIndex.vue'),
      },
      {
        path: 'create',
        name: 'createList',
        component: () => import('../../../pages/Admin/List/Create.vue'),
      },
      {
        path: ':id/edit',
        name: 'editList',
        component: () => import('../../../pages/Admin/List/Edit.vue'),
      },
    ]
  }
];
