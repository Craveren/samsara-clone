import { lazy } from 'react';

const EstateReport = lazy(() => import('./EstateReport'));

const EstateReportAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'services/report',
      element: <EstateReport />,
    },
  ],
};

export default EstateReportAppConfig;
