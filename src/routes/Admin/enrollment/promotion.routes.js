const ROUTE_NAME = 'admin/enrollments/promotions';

export const promotionRoutes = [{
  path: `/${ROUTE_NAME}`,
  children: [
    {
      path: "",
      name: 'admin/enrollments/promotions',
      component: () => import('../../../pages/Admin/Promotion/PromotionIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'create',
      name: 'createPromotion',
      component: () => import('../../../pages/Admin/Promotion/Create.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/edit',
      name: 'editPromotion',
      component: () => import('../../../pages/Admin/Promotion/Edit.vue'),
      meta: { roles: ['Administrador'] },
    },
  ]
}];
