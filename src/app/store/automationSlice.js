import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAutomationRules = createAsyncThunk('automation/getRules', async () => {
  const response = await axios.get('/api/automation/rules');
  return response.data;
});

export const saveAutomationRule = createAsyncThunk('automation/saveRule', async (ruleData) => {
  const response = await axios.post('/api/automation/rules', ruleData);
  return response.data;
});

export const testDeathVerification = createAsyncThunk('automation/testDeathVerification', async (testData) => {
  const response = await axios.post('/api/automation/test-death-verification', testData);
  return response.data;
});

const initialState = {
  // Death Verification Triggers
  deathVerification: {
    enabled: false,
    primaryContact: null,
    secondaryContacts: [],
    verificationMethods: ['death_certificate', 'trusted_contact', 'social_media'],
    autoUnlockDelay: 7, // days
    lastVerified: null,
    status: 'inactive' // inactive, pending, verified, failed
  },

  // Automated Notifications
  notifications: {
    annualReview: {
      enabled: true,
      frequency: 'yearly',
      lastSent: null,
      nextScheduled: null
    },
    documentExpiry: {
      enabled: true,
      daysBeforeExpiry: 30,
      lastChecked: null
    },
    beneficiaryUpdates: {
      enabled: true,
      trigger: 'changes_detected'
    }
  },

  // Digital Legacy Actions
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

  // Inactive User Detection
  inactivityDetection: {
    enabled: false,
    thresholdDays: 90,
    notificationContacts: [],
    escalationSteps: []
  },

  // Rules and Triggers
  rules: [],
  activeTriggers: [],
  triggerHistory: [],

  loading: false,
  error: null,
  lastUpdated: null
};

const automationSlice = createSlice({
  name: 'automation',
  initialState,
  reducers: {
    enableDeathVerification: (state, action) => {
      state.deathVerification.enabled = true;
      state.deathVerification.primaryContact = action.payload.primaryContact;
      state.deathVerification.secondaryContacts = action.payload.secondaryContacts || [];
      state.lastUpdated = new Date().toISOString();
    },
    disableDeathVerification: (state) => {
      state.deathVerification.enabled = false;
      state.deathVerification.status = 'inactive';
      state.lastUpdated = new Date().toISOString();
    },
    updateDeathVerificationContacts: (state, action) => {
      state.deathVerification.primaryContact = action.payload.primaryContact;
      state.deathVerification.secondaryContacts = action.payload.secondaryContacts || [];
      state.lastUpdated = new Date().toISOString();
    },
    setDeathVerificationStatus: (state, action) => {
      state.deathVerification.status = action.payload;
      if (action.payload === 'verified') {
        state.deathVerification.lastVerified = new Date().toISOString();
      }
    },
    updateNotificationSettings: (state, action) => {
      const { type, settings } = action.payload;
      if (state.notifications[type]) {
        state.notifications[type] = { ...state.notifications[type], ...settings };
        state.lastUpdated = new Date().toISOString();
      }
    },
    enableDigitalLegacy: (state, action) => {
      const { type, settings } = action.payload;
      if (state.digitalLegacy[type]) {
        state.digitalLegacy[type].enabled = true;
        state.digitalLegacy[type] = { ...state.digitalLegacy[type], ...settings };
        state.lastUpdated = new Date().toISOString();
      }
    },
    disableDigitalLegacy: (state, action) => {
      const { type } = action.payload;
      if (state.digitalLegacy[type]) {
        state.digitalLegacy[type].enabled = false;
        state.lastUpdated = new Date().toISOString();
      }
    },
    configureInactivityDetection: (state, action) => {
      state.inactivityDetection = { ...state.inactivityDetection, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    addAutomationRule: (state, action) => {
      state.rules.push(action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    updateAutomationRule: (state, action) => {
      const index = state.rules.findIndex(rule => rule.id === action.payload.id);
      if (index !== -1) {
        state.rules[index] = { ...state.rules[index], ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
    },
    deleteAutomationRule: (state, action) => {
      state.rules = state.rules.filter(rule => rule.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    addActiveTrigger: (state, action) => {
      state.activeTriggers.push(action.payload);
    },
    removeActiveTrigger: (state, action) => {
      state.activeTriggers = state.activeTriggers.filter(trigger => trigger.id !== action.payload);
    },
    addTriggerToHistory: (state, action) => {
      state.triggerHistory.unshift({
        ...action.payload,
        executedAt: new Date().toISOString()
      });
      // Keep only last 100 entries
      if (state.triggerHistory.length > 100) {
        state.triggerHistory = state.triggerHistory.slice(0, 100);
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAutomationRules.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAutomationRules.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = action.payload.rules || [];
        state.activeTriggers = action.payload.activeTriggers || [];
        state.triggerHistory = action.payload.triggerHistory || [];
      })
      .addCase(getAutomationRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveAutomationRule.fulfilled, (state, action) => {
        const index = state.rules.findIndex(rule => rule.id === action.payload.id);
        if (index !== -1) {
          state.rules[index] = action.payload;
        } else {
          state.rules.push(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(testDeathVerification.fulfilled, (state, action) => {
        state.deathVerification.status = action.payload.success ? 'verified' : 'failed';
        if (action.payload.success) {
          state.deathVerification.lastVerified = new Date().toISOString();
        }
      });
  }
});

export const {
  enableDeathVerification,
  disableDeathVerification,
  updateDeathVerificationContacts,
  setDeathVerificationStatus,
  updateNotificationSettings,
  enableDigitalLegacy,
  disableDigitalLegacy,
  configureInactivityDetection,
  addAutomationRule,
  updateAutomationRule,
  deleteAutomationRule,
  addActiveTrigger,
  removeActiveTrigger,
  addTriggerToHistory,
  clearError
} = automationSlice.actions;

export const selectAutomation = (state) => state.automation;
export const selectDeathVerification = (state) => state.automation.deathVerification;
export const selectNotifications = (state) => state.automation.notifications;
export const selectDigitalLegacy = (state) => state.automation.digitalLegacy;
export const selectInactivityDetection = (state) => state.automation.inactivityDetection;
export const selectAutomationRules = (state) => state.automation.rules;
export const selectActiveTriggers = (state) => state.automation.activeTriggers;
export const selectTriggerHistory = (state) => state.automation.triggerHistory;

export default automationSlice.reducer;
