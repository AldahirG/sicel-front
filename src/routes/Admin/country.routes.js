const ROUTE_NAME = 'admin/countries';

export const countryRoutes = [{
  path: `/${ROUTE_NAME}`,
  children: [
    {
      path: "",
      name: 'admin/countries',
      component: () => import('../../pages/Admin/Country/CountryIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: 'create',
      name: 'createCountry',
      component: () => import('../../pages/Admin/Country/Create.vue'),
      meta: { roles: ['Administrador'] },
    },
    {
      path: ':id/edit',
      name: 'editCountry',
      component: () => import('../../pages/Admin/Country/Edit.vue'),
      meta: { roles: ['Administrador'] },
    },
  ]
}];
