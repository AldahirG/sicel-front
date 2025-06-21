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
import {channelRoutes} from './enrollment/channel.routes';


const ROUTE_NAME = 'admin';

export const adminRoutes = [{
    path: `/${ROUTE_NAME}`,
    component: () => import('../../layouts/DashboardLayout.vue'),
    beforeEnter: [ adminGuard ],
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: 'admin',
            component: () => import('../../pages/Admin/AdminIndex.vue'),
        },
        
        ...userRoutes,

        ...careerRoutes,

        ...campaignRoutes,

        ...followUpRoutes,

        ...gradeRoutes,

        ...contactMediumRoutes,

        ...asetNameRoutes,

        ...cycleRoutes,

        ...countryRoutes,

        ...stateRoutes,

        ...cityRoutes,

        ...leadRoutes,

        ...enrollmentRoutes,
        ...listRoutes,
        ...channelRoutes,
    ]
}]