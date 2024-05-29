const ROUTE_NAME = 'promoter/leads';

export const leadRoutes = [{
    path: `/${ROUTE_NAME}`,
    children: [
        {
            path: "",
            name: 'promoter/leads',
            component: () => import('../../pages/Promoter/Lead/LeadIndex.vue'),
        },
        {
            path: 'create',
            name: 'createLeadPromotor',
            component: () => import('../../pages/Promoter/Lead/Create.vue'),
        },
        {
            path: ':id/edit',
            name: 'editLeadPromotor',
            component: () => import('../../pages/Promoter/Lead/Edit.vue'),
        },
        {
            path: ':id/show',
            name: 'showLeadPromotor',
            component: () => import('../../pages/Promoter/Lead/Show.vue'),
        },
    ]
}]