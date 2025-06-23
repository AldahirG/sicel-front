const ROUTE_NAME = 'promoter/enrollments';

export const enrollmentRoutes = [
  {
    path: `/${ROUTE_NAME}`,
    name: 'promoter/enrollments',
    component: () => import('../../pages/Promoter/Enrollment/EnrollmentIndex.vue'),
    meta: { roles: ['Promotor'] },
  },
  {
    path: `/${ROUTE_NAME}/:id/edit`,
    name: 'promoter/editEnrollment',
    component: () => import('../../pages/Promoter/Enrollment/Edit.vue'),
    meta: { roles: ['Promotor'] },
  },
  {
    path: `/${ROUTE_NAME}/:id/show`,
    name: 'promoter/showEnrollment',
    component: () => import('../../pages/Promoter/Enrollment/ShowEnrollment.vue'),
    meta: { roles: ['Promotor'] },
  },
];
