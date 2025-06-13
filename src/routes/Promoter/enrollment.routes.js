const ROUTE_NAME = 'promoter/enrollments';

export const enrollmentRoutes = [
  {
    path: `/${ROUTE_NAME}`,
    children: [
      {
        path: '',
        name: 'promoter/enrollments',
        component: () => import('../../pages/Promoter/Enrollment/EnrollmentIndex.vue'),
      },
      {
        path: ':id/edit',
        name: 'promoter/editEnrollment',
        component: () => import('../../pages/Promoter/Enrollment/Edit.vue'),
      },
      {
        path: ':id/show',
        name: 'promoter/showEnrollment',
        component: () => import('../../pages/Promoter/Enrollment/ShowEnrollment.vue'),
      },
    ],
  },
];
