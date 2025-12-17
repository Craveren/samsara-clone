import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getEstatePlan = createAsyncThunk('estatePlanning/getPlan', async () => {
  const response = await axios.get('/api/estate/plan');
  return response.data;
});

export const saveEstatePlan = createAsyncThunk('estatePlanning/savePlan', async (planData) => {
  const response = await axios.post('/api/estate/plan', planData);
  return response.data;
});

const initialState = {
  // Will and Trust Data
  will: {
    exists: false,
    lastUpdated: null,
    beneficiaries: [],
    executor: null,
    guardians: [],
    status: 'draft' // draft, completed, needs_review
  },
  trusts: [],
  healthcareDirective: {
    exists: false,
    lastUpdated: null,
    status: 'draft'
  },
  powerOfAttorney: {
    exists: false,
    lastUpdated: null,
    status: 'draft'
  },

  // Asset Inventory
  assets: {
    realEstate: [],
    bankAccounts: [],
    investments: [],
    personalProperty: [],
    digitalAssets: [],
    businessInterests: []
  },

  // Checklist Progress
  checklist: {
    totalTasks: 14,
    completedTasks: 0,
    categories: {
      documents: { total: 4, completed: 0 },
      beneficiaries: { total: 2, completed: 0 },
      assets: { total: 3, completed: 0 },
      healthcare: { total: 2, completed: 0 },
      digital: { total: 3, completed: 0 }
    }
  },

  // Status and Progress
  completionPercentage: 0,
  nextAction: 'Create your will',
  riskLevel: 'high',
  lastReviewDate: null,
  advisorNotes: [],

  loading: false,
  error: null
};

const estatePlanningSlice = createSlice({
  name: 'estatePlanning',
  initialState,
  reducers: {
    updateWill: (state, action) => {
      state.will = { ...state.will, ...action.payload };
      state.checklist.categories.documents.completed = Math.min(
        state.checklist.categories.documents.total,
        state.checklist.categories.documents.completed + (action.payload.status === 'completed' ? 1 : 0)
      );
    },
    addTrust: (state, action) => {
      state.trusts.push(action.payload);
    },
    updateTrust: (state, action) => {
      const index = state.trusts.findIndex(trust => trust.id === action.payload.id);
      if (index !== -1) {
        state.trusts[index] = { ...state.trusts[index], ...action.payload };
      }
    },
    updateHealthcareDirective: (state, action) => {
      state.healthcareDirective = { ...state.healthcareDirective, ...action.payload };
      state.checklist.categories.healthcare.completed = Math.min(
        state.checklist.categories.healthcare.total,
        state.checklist.categories.healthcare.completed + (action.payload.status === 'completed' ? 1 : 0)
      );
    },
    updatePowerOfAttorney: (state, action) => {
      state.powerOfAttorney = { ...state.powerOfAttorney, ...action.payload };
    },
    addAsset: (state, action) => {
      const { category, asset } = action.payload;
      if (state.assets[category]) {
        state.assets[category].push(asset);
        state.checklist.categories.assets.completed = Math.min(
          state.checklist.categories.assets.total,
          state.assets[category].length
        );
      }
    },
    updateAsset: (state, action) => {
      const { category, assetId, updates } = action.payload;
      if (state.assets[category]) {
        const index = state.assets[category].findIndex(asset => asset.id === assetId);
        if (index !== -1) {
          state.assets[category][index] = { ...state.assets[category][index], ...updates };
        }
      }
    },
    completeChecklistItem: (state, action) => {
      const { category, itemId } = action.payload;
      if (state.checklist.categories[category]) {
        state.checklist.categories[category].completed = Math.min(
          state.checklist.categories[category].total,
          state.checklist.categories[category].completed + 1
        );
      }
      state.checklist.completedTasks = Object.values(state.checklist.categories)
        .reduce((total, cat) => total + cat.completed, 0);
      state.completionPercentage = (state.checklist.completedTasks / state.checklist.totalTasks) * 100;
    },
    setNextAction: (state, action) => {
      state.nextAction = action.payload;
    },
    updateRiskLevel: (state, action) => {
      state.riskLevel = action.payload;
    },
    addAdvisorNote: (state, action) => {
      state.advisorNotes.push({
        ...action.payload,
        timestamp: new Date().toISOString()
      });
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEstatePlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEstatePlan.fulfilled, (state, action) => {
        state.loading = false;
        // Merge the loaded data with initial state
        Object.keys(action.payload).forEach(key => {
          if (state[key] !== undefined) {
            state[key] = action.payload[key];
          }
        });
      })
      .addCase(getEstatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveEstatePlan.fulfilled, (state) => {
        state.lastReviewDate = new Date().toISOString();
      });
  }
});

export const {
  updateWill,
  addTrust,
  updateTrust,
  updateHealthcareDirective,
  updatePowerOfAttorney,
  addAsset,
  updateAsset,
  completeChecklistItem,
  setNextAction,
  updateRiskLevel,
  addAdvisorNote,
  clearError
} = estatePlanningSlice.actions;

export const selectEstatePlanning = (state) => state.estatePlanning;
export const selectWill = (state) => state.estatePlanning.will;
export const selectTrusts = (state) => state.estatePlanning.trusts;
export const selectAssets = (state) => state.estatePlanning.assets;
export const selectChecklist = (state) => state.estatePlanning.checklist;
export const selectCompletionPercentage = (state) => state.estatePlanning.completionPercentage;
export const selectNextAction = (state) => state.estatePlanning.nextAction;
export const selectRiskLevel = (state) => state.estatePlanning.riskLevel;

export default estatePlanningSlice.reducer;
