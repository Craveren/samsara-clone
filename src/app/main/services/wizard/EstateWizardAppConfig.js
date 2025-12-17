import { lazy } from 'react';

const EstateWizard = lazy(() => import('./EstateWizard'));

const EstateWizardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'planning/wizard',
      element: <EstateWizard />,
    },
  ],
};

export default EstateWizardAppConfig;
