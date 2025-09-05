const ROUTE_NAME = 'admin/campaigns';

export const campaignRoutes = [{
  path: `/${ROUTE_NAME}`,
  children: [
    {
      path: "",
      name: 'admin/campaigns',
      component: () => import('../../pages/Admin/Campaign/CampaignIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'create',
      name: 'createCampaign',
      component: () => import('../../pages/Admin/Campaign/Create.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/edit',
      name: 'editCampaign',
      component: () => import('../../pages/Admin/Campaign/Edit.vue'),
      meta: { roles: ['Administrador'] },
    },
  ]
}];
