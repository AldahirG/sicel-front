const ROUTE_NAME = 'admin/campaigns';

export const campaignRoutes = [{
    path: `/${ROUTE_NAME}`,
    children: [
        {
            path: "",
            name: 'admin/campaigns',
            component: () => import('../../pages/Admin/Campaign/CampaignIndex.vue'),
        },
        {
            path: 'create',
            name: 'createCampaign',
            component: () => import('../../pages/Admin/Campaign/Create.vue'),
        },
        {
            path: ':id/edit',
            name: 'editCampaign',
            component: () => import('../../pages/Admin/Campaign/Edit.vue'),
        },
    ]
}]