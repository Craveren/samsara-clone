import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  completionPercentage: 85,
  totalTasks: 14,
  completedTasks: 12,
  estateValue: 850000,
  lastUpdated: null,
  healthScore: 78,
  netWorthProjection: 1250000,
  nextAction: 'Nominate executor',
  riskLevel: 'medium',
  criticalAlerts: 2,
  warnings: 3,
  recommendations: [
    'Update beneficiary contact information',
    'Review document expiration dates',
    'Complete healthcare directive',
    'Schedule annual estate review'
  ],
};

const estateStatusSlice = createSlice({
  name: 'estateOverviewApp/estateStatus',
  initialState,
  reducers: {
    updateCompletion: (state, action) => {
      state.completionPercentage = action.payload;
    },
    updateEstateValue: (state, action) => {
      state.estateValue = action.payload;
    },
    updateNextAction: (state, action) => {
      state.nextAction = action.payload;
    },
    updateHealthScore: (state, action) => {
      state.healthScore = action.payload;
    },
    updateNetWorthProjection: (state, action) => {
      state.netWorthProjection = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add any async thunk cases here if needed
  },
});

export const {
  updateCompletion,
  updateEstateValue,
  updateNextAction,
  updateHealthScore,
  updateNetWorthProjection,
} = estateStatusSlice.actions;

export const selectEstateStatus = ({ estateOverviewApp }) => estateOverviewApp.estateStatus;

export default estateStatusSlice.reducer;
