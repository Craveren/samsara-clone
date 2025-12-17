import ExecutorCommunication from './ExecutorCommunication';

const ExecutorCommunicationAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'services/communication',
      element: <ExecutorCommunication />,
    },
  ],
};

export default ExecutorCommunicationAppConfig;
