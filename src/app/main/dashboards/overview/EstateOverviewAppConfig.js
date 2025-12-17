import { lazy } from 'react';

const EstateOverviewApp = lazy(() => import('./EstateOverviewApp'));

const EstateOverviewAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboard/overview',
      element: <EstateOverviewApp />,
    },
  ],
};

export default EstateOverviewAppConfig;
