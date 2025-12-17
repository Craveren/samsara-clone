import { lazy } from 'react';

const EstateTasks = lazy(() => import('./EstateTasks'));

const EstateTasksAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'services/tasks',
      element: <EstateTasks />,
    },
  ],
};

export default EstateTasksAppConfig;
