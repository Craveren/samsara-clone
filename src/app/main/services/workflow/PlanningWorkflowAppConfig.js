import { lazy } from 'react';

const PlanningWorkflow = lazy(() => import('./PlanningWorkflow'));

const PlanningWorkflowAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'services/workflow',
      element: <PlanningWorkflow />,
    },
  ],
};

export default PlanningWorkflowAppConfig;
