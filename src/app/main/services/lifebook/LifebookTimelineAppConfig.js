import { lazy } from 'react';

const LifebookTimeline = lazy(() => import('./LifebookTimeline'));

const LifebookTimelineAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'lifebook/timeline',
      element: <LifebookTimeline />,
    },
  ],
};

export default LifebookTimelineAppConfig;
