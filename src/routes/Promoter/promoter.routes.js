import { promoterGuard } from '../../core/guards/roles.guard';
import { leadRoutes } from './lead.routes';
import { enrollmentRoutes } from './enrollment.routes';

const ROUTE_NAME = 'promoter';

export const promoterRoutes = [{
  path: `/${ROUTE_NAME}`,
  component: () => import('../../layouts/DashboardLayout.vue'),
  beforeEnter: [promoterGuard],
  meta: { roles: ['Promotor'] }, // ✅ Meta en layout principal
  children: [
    {
      path: '',
      name: 'promoter',
      component: () => import('../../pages/Promoter/PromoterIndex.vue'),
      meta: { roles: ['Promotor'] }, // ✅ Meta en vista principal
    },
    // Aplicamos meta a cada ruta hija
    ...leadRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Promotor'] }
    })),
    ...enrollmentRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Promotor'] }
    }))
  ]
}];
