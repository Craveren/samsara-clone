import { lazy } from 'react';

const BeneficiaryAllocation = lazy(() => import('./BeneficiaryAllocation'));

const BeneficiaryAllocationAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboard/allocation',
      element: <BeneficiaryAllocation />,
    },
  ],
};

export default BeneficiaryAllocationAppConfig;
