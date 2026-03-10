const ROUTE_NAME = 'promoter/leads';

export const leadRoutes = [
  {
    path: `/${ROUTE_NAME}`,
    name: 'promoter/leads',
    component: () => import('../../pages/Promoter/Lead/LeadIndex.vue'),
    meta: { roles: ['Promotor'] },
  },
  {
    path: `/${ROUTE_NAME}/:id/edit`,
    name: 'editLeadPromotor',
    component: () => import('../../pages/Promoter/Lead/Edit.vue'),
    meta: { roles: ['Promotor'] },
  },
  {
    path: `/${ROUTE_NAME}/:id/show`,
    name: 'showLeadPromotor',
    component: () => import('../../pages/Promoter/Lead/Show.vue'),
    meta: { roles: ['Promotor'] },
  },
  {
    path: `/${ROUTE_NAME}/create`,
    name: 'createLeadPromotor',
    component: () => import('../../pages/Promoter/Lead/Create.vue'),
    meta: { roles: ['Promotor'] },
  },
];
