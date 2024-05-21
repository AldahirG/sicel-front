const ROUTE_NAME = 'admin/contact-mediums';

export const contactMediumRoutes = [{
    path: `/${ROUTE_NAME}`,
    children: [
        {
            path: "",
            name: 'admin/contact-mediums',
            component: () => import('../../pages/Admin/ContactMedium/ContactMediumIndex.vue'),
        },
        {
            path: 'create',
            name: 'createContactMedium',
            component: () => import('../../pages/Admin/ContactMedium/Create.vue'),
        },
        {
            path: ':id/edit',
            name: 'editContactMedium',
            component: () => import('../../pages/Admin/ContactMedium/Edit.vue'),
        },
    ]
}]