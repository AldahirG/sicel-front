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
            name: 'createLead',
            component: () => import('../../pages/Promoter/Lead/Create.vue'),
        },
        {
            path: ':id/edit',
            name: 'editLead',
            component: () => import('../../pages/Promoter/Lead/Edit.vue'),
        },
        {
            path: ':id/show',
            name: 'showLead',
            component: () => import('../../pages/Promoter/Lead/Show.vue'),
        },
    ]
}]