import { lazy } from 'react';

const AutomationTriggers = lazy(() => import('./AutomationTriggers'));

const AutomationTriggersAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'automation/triggers',
      element: <AutomationTriggers />,
    },
  ],
};

export default AutomationTriggersAppConfig;
