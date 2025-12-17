import { lazy } from 'react';

const Beneficiaries = lazy(() => import('./Beneficiaries'));

const BeneficiariesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'people/beneficiaries',
      element: <Beneficiaries />,
    },
  ],
};

export default BeneficiariesAppConfig;
