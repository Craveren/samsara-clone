import { lazy } from 'react';

const LegalMarketplace = lazy(() => import('./LegalMarketplace'));

const LegalMarketplaceAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'services/legal-marketplace',
      element: <LegalMarketplace />,
    },
  ],
};

export default LegalMarketplaceAppConfig;
