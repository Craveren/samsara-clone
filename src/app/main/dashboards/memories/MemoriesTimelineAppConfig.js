import { lazy } from 'react';

const MemoriesTimelineApp = lazy(() => import('./MemoriesTimelineApp'));

const MemoriesTimelineAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboard/memories',
      element: <MemoriesTimelineApp />,
    },
  ],
};

export default MemoriesTimelineAppConfig;
