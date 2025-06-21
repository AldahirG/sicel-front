const ROUTE_NAME = 'promoter/leads';

export const leadRoutes = [{
  path: `/${ROUTE_NAME}`,
  meta: { roles: ['Promotor'] }, // ← AÑADIDO AQUÍ
  children: [
    {
      path: "",
      name: 'promoter/leads',
      component: () => import('../../pages/Promoter/Lead/LeadIndex.vue'),
      meta: { roles: ['Promotor'] } // ← AÑADIDO AQUÍ
    },
    {
      path: ':id/edit',
      name: 'editLeadPromotor',
      component: () => import('../../pages/Promoter/Lead/Edit.vue'),
      meta: { roles: ['Promotor'] } // ← AÑADIDO AQUÍ
    },
    {
      path: ':id/show',
      name: 'showLeadPromotor',
      component: () => import('../../pages/Promoter/Lead/Show.vue'),
      meta: { roles: ['Promotor'] } // ← AÑADIDO AQUÍ
    },
    {
      path: 'create',
      name: 'createLeadPromotor',
      component: () => import('../../pages/Promoter/Lead/Create.vue'),
      meta: { roles: ['Promotor'] } // ← AÑADIDO AQUÍ
    }
  ]
}]
