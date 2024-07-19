import { promoterGuard } from '../../core/guards/roles.guard';
import { leadRoutes } from './lead.routes';
import { enrollmentRoutes } from './enrollment.routes';

const ROUTE_NAME = 'promoter';

export const promoterRoutes = [{
    path: `/${ROUTE_NAME}`,
    component: () => import('../../layouts/DashboardLayout.vue'),
    beforeEnter: [ promoterGuard ],
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: 'promoter',
            component: () => import('../../pages/Promoter/PromoterIndex.vue'),
        },

        ...leadRoutes,

        ...enrollmentRoutes,
    ]
}]