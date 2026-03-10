const ROUTE_NAME = 'admin/leads';

export const leadRoutes = [{
  path: `/${ROUTE_NAME}`,
  children: [
    {
      path: "",
      name: 'admin/leads',
      component: () => import('../../pages/Admin/Lead/LeadIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'create',
      name: 'createLead',
      component: () => import('../../pages/Admin/Lead/Create.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/edit',
      name: 'editLead',
      component: () => import('../../pages/Admin/Lead/Edit.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/show',
      name: 'showLead',
      component: () => import('../../pages/Admin/Lead/Show.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'upload',
      name: 'uploadLead',
      component: () => import('../../pages/Admin/Lead/Upload.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/assignment',
      name: 'assignmentLead',
      component: () => import('../../pages/Admin/Lead/Assignment.vue'),
      meta: { roles: ['Administrador'] },
    },
  ]
}];
