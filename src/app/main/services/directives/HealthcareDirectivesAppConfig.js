import { lazy } from 'react';

const HealthcareDirectives = lazy(() => import('./HealthcareDirectives'));

const HealthcareDirectivesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'services/directives',
      element: <HealthcareDirectives />,
    },
  ],
};

export default HealthcareDirectivesAppConfig;
