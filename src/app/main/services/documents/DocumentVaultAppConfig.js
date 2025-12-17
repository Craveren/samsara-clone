import { lazy } from 'react';

const DocumentVault = lazy(() => import('./DocumentVault'));

const DocumentVaultAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'documents/vault',
      element: <DocumentVault />,
    },
  ],
};

export default DocumentVaultAppConfig;
