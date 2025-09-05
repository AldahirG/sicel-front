const ROUTE_NAME = 'admin/follow-ups';

export const followUpRoutes = [{
  path: `/${ROUTE_NAME}`,
  children: [
    {
      path: "",
      name: 'admin/follow_ups',
      component: () => import('../../pages/Admin/FollowUp/FollowUpIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'create',
      name: 'createFollowUp',
      component: () => import('../../pages/Admin/FollowUp/Create.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/edit',
      name: 'editFollowUp',
      component: () => import('../../pages/Admin/FollowUp/Edit.vue'),
      meta: { roles: ['Administrador'] },
    },
  ]
}];
