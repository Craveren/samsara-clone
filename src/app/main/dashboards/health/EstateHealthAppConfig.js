import { lazy } from 'react';

const EstateHealthApp = lazy(() => import('./EstateHealthApp'));

const EstateHealthAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboard/health',
      element: <EstateHealthApp />,
    },
  ],
};

export default EstateHealthAppConfig;
