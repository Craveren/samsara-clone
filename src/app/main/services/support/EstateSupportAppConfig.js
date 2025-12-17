import { lazy } from 'react';

const EstateSupport = lazy(() => import('./EstateSupport'));

const EstateSupportAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'services/support',
      element: <EstateSupport />,
    },
  ],
};

export default EstateSupportAppConfig;
