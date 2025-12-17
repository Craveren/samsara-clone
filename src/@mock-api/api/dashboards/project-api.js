import mock from '../../mock';

// Estate Overview Dashboard Mock Data
const estateOverviewWidgets = {
  overview: {
    completionPercentage: 85,
    totalTasks: 14,
    completedTasks: 12,
    estateValue: 1250000,
    netWorthProjection: 1250000,
    healthScore: 78,
    nextAction: 'Nominate executor',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  analytics: {
    estateValueBreakdown: {
      realEstate: 450000,
      investments: 280000,
      bankAccounts: 95000,
      retirementAccounts: 350000,
      personalProperty: 75000,
      digitalAssets: 25000
    },
    beneficiaryAllocations: [
      { name: 'Sarah Johnson', relationship: 'Spouse', allocation: 50 },
      { name: 'Emily Johnson', relationship: 'Daughter', allocation: 25 },
      { name: 'Michael Johnson', relationship: 'Son', allocation: 25 }
    ],
    documentStatus: {
      completed: 12,
      inProgress: 3,
      pending: 2,
      overdue: 1
    }
  },
  activity: [
    {
      id: 1,
      type: 'document',
      title: 'Will document updated',
      description: 'Last will and testament updated with new beneficiary information',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'beneficiary',
      title: 'Beneficiary added',
      description: 'Emily Johnson added as beneficiary with 25% allocation',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'executor',
      title: 'Executor nominated',
      description: 'John Smith nominated as estate executor',
      timestamp: '3 days ago',
      status: 'completed'
    }
  ]
};

mock.onGet('/api/dashboards/estate/widgets').reply((config) => {
  return [200, estateOverviewWidgets];
});

mock.onGet('/api/dashboards/estate/overview').reply((config) => {
  return [200, estateOverviewWidgets.overview];
});

mock.onGet('/api/dashboards/estate/analytics').reply((config) => {
  return [200, estateOverviewWidgets.analytics];
});

mock.onGet('/api/dashboards/estate/activity').reply((config) => {
  return [200, estateOverviewWidgets.activity];
});
