import mock from '../mock';

// Woodpecker Estate Planning Mock APIs

// Lifebook Timeline Data
const lifebookData = {
  timeline: [
    {
      id: 1,
      type: 'milestone',
      title: 'Graduated College',
      date: '2005-05-15',
      description: 'Earned Bachelor\'s degree in Business Administration',
      status: 'completed',
      color: 'green',
      branch: 'education'
    },
    {
      id: 2,
      type: 'relationship',
      title: 'Married Sarah',
      date: '2008-06-20',
      description: 'Married Sarah Johnson, started building our family',
      status: 'completed',
      color: 'blue',
      branch: 'personal'
    },
    {
      id: 3,
      type: 'career',
      title: 'Started Tech Company',
      date: '2010-03-01',
      description: 'Founded first technology startup',
      status: 'completed',
      color: 'green',
      branch: 'career'
    },
    {
      id: 4,
      type: 'family',
      title: 'Emily Born',
      date: '2012-09-15',
      description: 'Welcome Emily to our family',
      status: 'completed',
      color: 'blue',
      branch: 'family'
    },
    {
      id: 5,
      type: 'achievement',
      title: 'Company IPO',
      date: '2018-11-08',
      description: 'Successful IPO of our tech company',
      status: 'completed',
      color: 'green',
      branch: 'career'
    },
    {
      id: 6,
      type: 'family',
      title: 'Michael Born',
      date: '2020-04-22',
      description: 'Welcome Michael to complete our family',
      status: 'completed',
      color: 'blue',
      branch: 'family'
    }
  ],
  streakCount: 7,
  totalEdits: 23,
  lastSaved: '2024-01-15T14:30:00Z'
};

// Document Vault Data
const documentVaultData = {
  documents: [
    {
      id: 1,
      name: 'Last Will and Testament',
      category: 'Wills',
      status: 'signed',
      lastModified: '2024-01-10T09:15:00Z',
      size: 2457600,
      shared: true,
      encrypted: true,
      versions: 3
    },
    {
      id: 2,
      name: 'Healthcare Power of Attorney',
      category: 'Healthcare',
      status: 'signed',
      lastModified: '2024-01-08T11:30:00Z',
      size: 1843200,
      shared: true,
      encrypted: true,
      versions: 2
    },
    {
      id: 3,
      name: 'Life Insurance Policy',
      category: 'Insurance',
      status: 'uploaded',
      lastModified: '2024-01-05T16:45:00Z',
      size: 5120000,
      shared: false,
      encrypted: true,
      versions: 1
    },
    {
      id: 4,
      name: 'Investment Portfolio Statement',
      category: 'Financial',
      status: 'uploaded',
      lastModified: '2024-01-12T13:20:00Z',
      size: 1536000,
      shared: false,
      encrypted: true,
      versions: 1
    }
  ],
  categories: ['Wills', 'Trusts', 'Insurance', 'Healthcare', 'Legal', 'Financial', 'Property'],
  usedStorage: 1250000000, // 1.25GB
  totalStorage: 5000000000, // 5GB
  recentUploads: [],
  sharedDocuments: [1, 2] // document IDs that are shared
};

// Beneficiary Tree Data
const beneficiaryTreeData = {
  familyTree: [
    {
      id: 1,
      name: 'John Smith',
      relationship: 'self',
      dateOfBirth: '1980-03-15',
      ssn: '***-**-1234'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      relationship: 'spouse',
      dateOfBirth: '1982-07-22',
      ssn: '***-**-5678'
    },
    {
      id: 3,
      name: 'Emily Johnson',
      relationship: 'daughter',
      dateOfBirth: '2012-09-15',
      ssn: '***-**-9012'
    },
    {
      id: 4,
      name: 'Michael Johnson',
      relationship: 'son',
      dateOfBirth: '2020-04-22',
      ssn: '***-**-3456'
    }
  ],
  beneficiaries: [
    {
      id: 2,
      name: 'Sarah Johnson',
      relationship: 'spouse',
      allocation: 50,
      type: 'primary'
    },
    {
      id: 3,
      name: 'Emily Johnson',
      relationship: 'daughter',
      allocation: 25,
      type: 'primary'
    },
    {
      id: 4,
      name: 'Michael Johnson',
      relationship: 'son',
      allocation: 25,
      type: 'primary'
    }
  ],
  executors: [
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'executor',
      permissions: ['view', 'manage']
    }
  ],
  charities: [],
  trusts: [],
  assetAllocations: {},
  lastUpdated: '2024-01-15T10:30:00Z'
};

// Estate Planning Data
const estatePlanningData = {
  will: {
    exists: true,
    lastUpdated: '2024-01-10T09:15:00Z',
    status: 'completed'
  },
  trusts: [
    {
      id: 1,
      name: 'Family Trust',
      type: 'revocable',
      status: 'completed',
      lastUpdated: '2024-01-08T11:30:00Z'
    }
  ],
  healthcareDirective: {
    exists: false,
    lastUpdated: null,
    status: 'draft'
  },
  powerOfAttorney: {
    exists: true,
    lastUpdated: '2024-01-08T11:30:00Z',
    status: 'completed'
  },
  assets: {
    realEstate: [
      {
        id: 1,
        name: 'Primary Residence',
        value: 450000,
        address: '123 Main St, Anytown, USA'
      }
    ],
    bankAccounts: [
      {
        id: 1,
        name: 'Checking Account',
        institution: 'First Bank',
        value: 45000
      },
      {
        id: 2,
        name: 'Savings Account',
        institution: 'First Bank',
        value: 50000
      }
    ],
    investments: [
      {
        id: 1,
        name: '401(k)',
        institution: 'Fidelity',
        value: 280000
      }
    ],
    personalProperty: [],
    digitalAssets: [],
    businessInterests: []
  },
  checklist: {
    totalTasks: 14,
    completedTasks: 12,
    categories: {
      documents: { total: 4, completed: 4 },
      beneficiaries: { total: 2, completed: 2 },
      assets: { total: 3, completed: 3 },
      healthcare: { total: 2, completed: 1 },
      digital: { total: 3, completed: 2 }
    }
  },
  completionPercentage: 85,
  nextAction: 'Complete healthcare directive',
  riskLevel: 'medium'
};

// Automation Data
const automationData = {
  deathVerification: {
    enabled: false,
    primaryContact: null,
    secondaryContacts: [],
    verificationMethods: ['death_certificate', 'trusted_contact', 'social_media'],
    autoUnlockDelay: 7,
    lastVerified: null,
    status: 'inactive'
  },
  notifications: {
    annualReview: {
      enabled: true,
      frequency: 'yearly',
      lastSent: '2023-12-15T10:00:00Z',
      nextScheduled: '2024-12-15T10:00:00Z'
    },
    documentExpiry: {
      enabled: true,
      daysBeforeExpiry: 30,
      lastChecked: '2024-01-15T08:00:00Z'
    },
    beneficiaryUpdates: {
      enabled: true,
      trigger: 'changes_detected'
    }
  },
  digitalLegacy: {
    socialMedia: {
      enabled: false,
      platforms: [],
      memorializationSettings: {}
    },
    accountCancellation: {
      enabled: false,
      services: [],
      instructions: {}
    },
    dataPreservation: {
      enabled: false,
      cloudStorage: null,
      dataTypes: []
    }
  },
  inactivityDetection: {
    enabled: false,
    thresholdDays: 90,
    notificationContacts: [],
    escalationSteps: []
  },
  rules: [],
  activeTriggers: [],
  triggerHistory: []
};

// API Endpoints
mock.onGet('/api/lifebook/timeline').reply(() => {
  return [200, lifebookData];
});

mock.onPost('/api/lifebook/timeline').reply((config) => {
  const newNode = JSON.parse(config.data);
  lifebookData.timeline.push({ ...newNode, id: Date.now() });
  return [200, newNode];
});

mock.onGet('/api/documents/vault').reply(() => {
  return [200, documentVaultData];
});

mock.onPost('/api/documents/upload').reply((config) => {
  const newDoc = JSON.parse(config.data);
  const document = { ...newDoc, id: Date.now(), status: 'uploaded' };
  documentVaultData.documents.push(document);
  return [200, document];
});

mock.onGet('/api/beneficiaries/tree').reply(() => {
  return [200, beneficiaryTreeData];
});

mock.onPost('/api/beneficiaries/tree').reply((config) => {
  const updates = JSON.parse(config.data);
  Object.assign(beneficiaryTreeData, updates);
  return [200, beneficiaryTreeData];
});

mock.onGet('/api/estate/plan').reply(() => {
  return [200, estatePlanningData];
});

mock.onPost('/api/estate/plan').reply((config) => {
  const updates = JSON.parse(config.data);
  Object.assign(estatePlanningData, updates);
  return [200, estatePlanningData];
});

mock.onGet('/api/automation/rules').reply(() => {
  return [200, automationData];
});

mock.onPost('/api/automation/rules').reply((config) => {
  const newRule = JSON.parse(config.data);
  automationData.rules.push({ ...newRule, id: Date.now() });
  return [200, newRule];
});
