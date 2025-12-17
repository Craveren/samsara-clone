import { lazy } from 'react';

const PeckLog = lazy(() => import('./PeckLog'));

const PeckLogAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboard/heat-map',
      element: <PeckLog />,
    },
  ],
};

export default PeckLogAppConfig;
