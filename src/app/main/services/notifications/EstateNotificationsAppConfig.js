import { lazy } from 'react';

const EstateNotifications = lazy(() => import('./EstateNotifications'));

const EstateNotificationsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'services/notifications',
      element: <EstateNotifications />,
    },
  ],
};

export default EstateNotificationsAppConfig;
