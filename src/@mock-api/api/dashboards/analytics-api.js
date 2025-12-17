import mock from '../../mock';

// Estate Health ICU Room Mock Data
const estateHealthWidgets = {
  vitals: {
    overallHealthScore: 78,
    documentHealth: 85,
    beneficiaryHealth: 90,
    taskCompletion: 65,
    riskLevel: 'medium',
    criticalAlerts: 2,
    warnings: 3,
    lastAssessment: '2024-01-15T10:30:00Z'
  },
  documentHealth: {
    totalDocuments: 14,
    completedDocuments: 12,
    expiringSoon: 2,
    overdue: 1,
    categories: {
      wills: { total: 1, completed: 1 },
      trusts: { total: 2, completed: 1 },
      insurance: { total: 3, completed: 3 },
      healthcare: { total: 2, completed: 1 },
      financial: { total: 4, completed: 3 },
      property: { total: 2, completed: 1 }
    }
  },
  beneficiaryStatus: {
    totalBeneficiaries: 3,
    fullyConfigured: 2,
    needsAttention: 1,
    executors: 1,
    unallocatedPercentage: 0
  },
  taskProgress: {
    totalTasks: 14,
    completedTasks: 12,
    inProgressTasks: 2,
    overdueTasks: 1,
    categories: {
      documents: { completed: 4, total: 4 },
      beneficiaries: { completed: 2, total: 2 },
      assets: { completed: 3, total: 3 },
      healthcare: { completed: 1, total: 2 },
      digital: { completed: 2, total: 3 }
    }
  },
  riskAlerts: [
    {
      id: 1,
      type: 'critical',
      title: 'Will Document Expiring',
      description: 'Your will document is due for review and may need updates.',
      actionRequired: 'Review and update will',
      dueDate: '2024-02-15'
    },
    {
      id: 2,
      type: 'critical',
      title: 'No Executor Designated',
      description: 'You have not designated an executor for your estate.',
      actionRequired: 'Nominate executor',
      dueDate: 'Immediate'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Healthcare Directive Incomplete',
      description: 'Your healthcare directive is missing advance care instructions.',
      actionRequired: 'Complete healthcare directive',
      dueDate: '2024-03-01'
    }
  ],
  healthTrends: [
    { date: '2023-10', score: 65 },
    { date: '2023-11', score: 70 },
    { date: '2023-12', score: 75 },
    { date: '2024-01', score: 78 }
  ],
  completionMetrics: {
    overallProgress: 85,
    documentsCompleted: 12,
    beneficiariesConfigured: 3,
    assetsInventoried: 6,
    directivesCompleted: 1
  }
};

mock.onGet('/api/dashboards/estate-health/widgets').reply((config) => {
  return [200, estateHealthWidgets];
});

mock.onGet('/api/dashboards/estate-health/vitals').reply((config) => {
  return [200, estateHealthWidgets.vitals];
});

mock.onGet('/api/dashboards/estate-health/alerts').reply((config) => {
  return [200, estateHealthWidgets.riskAlerts];
});
