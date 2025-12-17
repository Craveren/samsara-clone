import { lazy } from 'react';

const EstateEducation = lazy(() => import('./EstateEducation'));

const EstateEducationAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'services/education',
      element: <EstateEducation />,
    },
  ],
};

export default EstateEducationAppConfig;
