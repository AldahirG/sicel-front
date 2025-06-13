import { promotionRoutes } from './promotion.routes.';

const ROUTE_NAME = 'admin/enrollments';

export const enrollmentRoutes = [{
    path: `/${ROUTE_NAME}`,
    children: [
        {
            path: "",
            name: 'admin/enrollments',
            component: () => import('../../../pages/Admin/Enrollment/EnrollmentIndex.vue'),
        },
        {
            path: ':id/edit',
            name: 'admin/editEnrollment',
            component: () => import('../../../pages/Admin/Enrollment/Edit.vue'),
        },
        {
            path: 'show/:id',
            name: 'admin/showEnrollment',
            component: () => import('../../../pages/Admin/Enrollment/ShowEnrollment.vue'),
        },

        ...promotionRoutes,
    ]
}]