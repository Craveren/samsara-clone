import { lazy } from 'react';

const moreDetialsApp = lazy(() => import('./moreDetials.js'));

const ProjectDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboards/project/moreDetails',
      element: <moreDetialsApp />,
    },
  ],
};

export default moreDetialsApp;