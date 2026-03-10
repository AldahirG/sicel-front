const ROUTE_NAME = 'admin/contact-mediums';

export const contactMediumRoutes = [{
  path: `/${ROUTE_NAME}`,
  children: [
    {
      path: "",
      name: 'admin/contact-mediums',
      component: () => import('../../pages/Admin/ContactMedium/ContactMediumIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'create',
      name: 'createContactMedium',
      component: () => import('../../pages/Admin/ContactMedium/Create.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/edit',
      name: 'editContactMedium',
      component: () => import('../../pages/Admin/ContactMedium/Edit.vue'),
      meta: { roles: ['Administrador'] },
    },
  ]
}];
