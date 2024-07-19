const ROUTE_NAME = 'promoter/enrollments';

export const enrollmentRoutes = [{
    path: `/${ROUTE_NAME}`,
    children: [
        {
            path: "",
            name: 'promoter/enrollments',
            component: () => import('../../pages/Promoter/Enrollment/EnrollmentIndex.vue'),
        },
    ]
}]