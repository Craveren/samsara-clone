import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  overallHealthScore: 78,
  documentHealth: 85,
  beneficiaryHealth: 90,
  taskCompletion: 65,
  riskLevel: 'medium',
  lastAssessment: new Date().toISOString(),
  criticalAlerts: 2,
  warnings: 3,
  recommendations: [
    'Update beneficiary contact information',
    'Review document expiration dates',
    'Complete healthcare directive',
    'Schedule annual estate review'
  ]
};

const estateHealthSlice = createSlice({
  name: 'estateHealthApp/estateHealth',
  initialState,
  reducers: {
    updateHealthScore: (state, action) => {
      state.overallHealthScore = action.payload;
    },
    updateDocumentHealth: (state, action) => {
      state.documentHealth = action.payload;
    },
    updateBeneficiaryHealth: (state, action) => {
      state.beneficiaryHealth = action.payload;
    },
    updateTaskCompletion: (state, action) => {
      state.taskCompletion = action.payload;
    },
    setRiskLevel: (state, action) => {
      state.riskLevel = action.payload;
    },
    addCriticalAlert: (state) => {
      state.criticalAlerts += 1;
    },
    addWarning: (state) => {
      state.warnings += 1;
    },
    updateLastAssessment: (state) => {
      state.lastAssessment = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // Add any async thunk cases here if needed
  },
});

export const {
  updateHealthScore,
  updateDocumentHealth,
  updateBeneficiaryHealth,
  updateTaskCompletion,
  setRiskLevel,
  addCriticalAlert,
  addWarning,
  updateLastAssessment,
} = estateHealthSlice.actions;

export const selectEstateHealth = ({ estateHealthApp }) => estateHealthApp.estateHealth;

export default estateHealthSlice.reducer;
