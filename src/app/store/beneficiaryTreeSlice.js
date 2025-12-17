import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getBeneficiaries = createAsyncThunk('beneficiaryTree/getBeneficiaries', async () => {
  const response = await axios.get('/api/beneficiaries/tree');
  return response.data;
});

export const saveBeneficiaryTree = createAsyncThunk('beneficiaryTree/saveTree', async (treeData) => {
  const response = await axios.post('/api/beneficiaries/tree', treeData);
  return response.data;
});

const initialState = {
  familyTree: [],
  executors: [],
  beneficiaries: [],
  assetAllocations: {},
  totalAllocation: 0,
  unallocatedPercentage: 100,
  loading: false,
  error: null,
  lastUpdated: null,
  primaryBeneficiaries: [],
  contingentBeneficiaries: [],
  charities: [],
  trusts: []
};

const beneficiaryTreeSlice = createSlice({
  name: 'beneficiaryTree',
  initialState,
  reducers: {
    addFamilyMember: (state, action) => {
      state.familyTree.push(action.payload);
    },
    updateFamilyMember: (state, action) => {
      const index = state.familyTree.findIndex(member => member.id === action.payload.id);
      if (index !== -1) {
        state.familyTree[index] = { ...state.familyTree[index], ...action.payload };
      }
    },
    removeFamilyMember: (state, action) => {
      state.familyTree = state.familyTree.filter(member => member.id !== action.payload);
      // Remove from beneficiaries if present
      state.beneficiaries = state.beneficiaries.filter(b => b.id !== action.payload);
      // Remove from executors if present
      state.executors = state.executors.filter(e => e.id !== action.payload);
    },
    setAsBeneficiary: (state, action) => {
      const { memberId, allocation } = action.payload;
      const member = state.familyTree.find(m => m.id === memberId);
      if (member) {
        const beneficiary = {
          ...member,
          allocation: allocation || 0,
          type: 'primary'
        };
        const existingIndex = state.beneficiaries.findIndex(b => b.id === memberId);
        if (existingIndex !== -1) {
          state.beneficiaries[existingIndex] = beneficiary;
        } else {
          state.beneficiaries.push(beneficiary);
        }
        state.lastUpdated = new Date().toISOString();
      }
    },
    setAsExecutor: (state, action) => {
      const memberId = action.payload;
      const member = state.familyTree.find(m => m.id === memberId);
      if (member && !state.executors.find(e => e.id === memberId)) {
        state.executors.push({
          ...member,
          role: 'executor',
          permissions: ['view', 'manage']
        });
        state.lastUpdated = new Date().toISOString();
      }
    },
    updateAllocation: (state, action) => {
      const { beneficiaryId, allocation } = action.payload;
      const beneficiary = state.beneficiaries.find(b => b.id === beneficiaryId);
      if (beneficiary) {
        beneficiary.allocation = allocation;
        state.lastUpdated = new Date().toISOString();
      }
    },
    calculateTotalAllocation: (state) => {
      state.totalAllocation = state.beneficiaries.reduce((total, beneficiary) => {
        return total + (beneficiary.allocation || 0);
      }, 0);
      state.unallocatedPercentage = Math.max(0, 100 - state.totalAllocation);
    },
    addCharity: (state, action) => {
      state.charities.push(action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    removeCharity: (state, action) => {
      state.charities = state.charities.filter(charity => charity.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    addTrust: (state, action) => {
      state.trusts.push(action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    removeTrust: (state, action) => {
      state.trusts = state.trusts.filter(trust => trust.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBeneficiaries.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBeneficiaries.fulfilled, (state, action) => {
        state.loading = false;
        state.familyTree = action.payload.familyTree || [];
        state.executors = action.payload.executors || [];
        state.beneficiaries = action.payload.beneficiaries || [];
        state.assetAllocations = action.payload.assetAllocations || {};
        state.charities = action.payload.charities || [];
        state.trusts = action.payload.trusts || [];
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(getBeneficiaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveBeneficiaryTree.fulfilled, (state) => {
        state.lastUpdated = new Date().toISOString();
      });
  }
});

export const {
  addFamilyMember,
  updateFamilyMember,
  removeFamilyMember,
  setAsBeneficiary,
  setAsExecutor,
  updateAllocation,
  calculateTotalAllocation,
  addCharity,
  removeCharity,
  addTrust,
  removeTrust,
  clearError
} = beneficiaryTreeSlice.actions;

export const selectBeneficiaryTree = (state) => state.beneficiaryTree;
export const selectFamilyTree = (state) => state.beneficiaryTree.familyTree;
export const selectBeneficiaries = (state) => state.beneficiaryTree.beneficiaries;
export const selectExecutors = (state) => state.beneficiaryTree.executors;
export const selectAllocationStats = (state) => ({
  total: state.beneficiaryTree.totalAllocation,
  unallocated: state.beneficiaryTree.unallocatedPercentage
});
export const selectCharities = (state) => state.beneficiaryTree.charities;
export const selectTrusts = (state) => state.beneficiaryTree.trusts;

export default beneficiaryTreeSlice.reducer;
