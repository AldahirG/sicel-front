const ROUTE_NAME = 'admin/countries';

export const countryRoutes = [{
    path: `/${ROUTE_NAME}`,
    children: [
        {
            path: "",
            name: 'admin/countries',
            component: () => import('../../pages/Admin/Country/CountryIndex.vue'),
        },
        {
            path: 'create',
            name: 'createCountry',
            component: () => import('../../pages/Admin/Country/Create.vue'),
        },
        {
            path: ':id/edit',
            name: 'editCountry',
            component: () => import('../../pages/Admin/Country/Edit.vue'),
        },
    ]
}]