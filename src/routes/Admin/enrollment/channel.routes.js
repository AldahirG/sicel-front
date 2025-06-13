const ROUTE_NAME = 'admin/enrollments/channels';

export const channelRoutes = [
  {
    path: `/${ROUTE_NAME}`,
    children: [
      {
        path: '',
        name: 'admin/enrollments/channels',
        component: () => import('../../../pages/Admin/Channel/ChannelIndex.vue'),
      },
      {
        path: 'create',
        name: 'createChannel',
        component: () => import('../../../pages/Admin/Channel/Create.vue'),
      },
      {
        path: ':id/edit',
        name: 'editChannel',
        component: () => import('../../../pages/Admin/Channel/Edit.vue'),
      },
    ],
  },
];
