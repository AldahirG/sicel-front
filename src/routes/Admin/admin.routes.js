import { adminGuard } from '../../core/guards/roles.guard';
import { userRoutes } from './user.routes';
import { careerRoutes } from './career.routes';
import { campaignRoutes } from './campaign.routes';
import { followUpRoutes } from './followUp.routes';
import { gradeRoutes } from './grade.routes';
import { contactMediumRoutes } from './contactMedium.routes';
import { asetNameRoutes } from './asetName.routes';
import { cycleRoutes } from './cycle.routes';
import { countryRoutes } from './country.routes';
import { stateRoutes } from './state.routes';
import { cityRoutes } from './city.routes';
import { leadRoutes } from './lead.routes';
import { enrollmentRoutes } from './enrollment/enrollment.routes';
import { listRoutes } from './enrollment/list.routes';
import { channelRoutes } from './enrollment/channel.routes';

const ROUTE_NAME = 'admin';

export const adminRoutes = [{
  path: `/${ROUTE_NAME}`,
  component: () => import('../../layouts/DashboardLayout.vue'),
  beforeEnter: [adminGuard],
  meta: { roles: ['Administrador'] }, // ✅ obligatorio
  children: [
    {
      path: '',
      name: 'admin',
      component: () => import('../../pages/Admin/AdminIndex.vue'),
      meta: { roles: ['Administrador'] },
    },
    ...userRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...careerRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...campaignRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...followUpRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...gradeRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...contactMediumRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...asetNameRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...cycleRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...countryRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...stateRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...cityRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...leadRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...enrollmentRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...listRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
    ...channelRoutes.map(route => ({
      ...route,
      meta: { ...(route.meta || {}), roles: ['Administrador'] }
    })),
  ]
}];
