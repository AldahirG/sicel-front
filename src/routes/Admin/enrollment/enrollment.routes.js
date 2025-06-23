import { promotionRoutes } from './promotion.routes';

const ROUTE_NAME = 'admin/enrollments';

export const enrollmentRoutes = [{
    path: `/${ROUTE_NAME}`,
    children: [
        {
            path: "",
            name: 'admin/enrollments',
            component: () => import('../../../pages/Admin/Enrollment/EnrollmentIndex.vue'),
            meta: { roles: ['Administrador'] },
        },
        {
            path: ':id/edit',
            name: 'admin/editEnrollment',
            component: () => import('../../../pages/Admin/Enrollment/Edit.vue'),
            meta: { roles: ['Administrador'] },
        },
        {
            path: 'show/:id',
            name: 'admin/showEnrollment',
            component: () => import('../../../pages/Admin/Enrollment/ShowEnrollment.vue'),
            meta: { roles: ['Administrador'] },
        },

        // Aseguramos que cada ruta heredada tenga también su meta de roles
        ...promotionRoutes.map(route => ({
            ...route,
            meta: { ...(route.meta || {}), roles: ['Administrador'] }
        })),
    ]
}];
