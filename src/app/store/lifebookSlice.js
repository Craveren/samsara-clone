import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getLifebookData = createAsyncThunk('lifebook/getData', async () => {
  const response = await axios.get('/api/lifebook/timeline');
  return response.data;
});

export const saveTimelineNode = createAsyncThunk('lifebook/saveNode', async (nodeData) => {
  const response = await axios.post('/api/lifebook/timeline', nodeData);
  return response.data;
});

const initialState = {
  timeline: [],
  currentStory: null,
  editMode: false,
  selectedNode: null,
  loading: false,
  error: null,
  lastSaved: null,
  streakCount: 0,
  totalEdits: 0
};

const lifebookSlice = createSlice({
  name: 'lifebook',
  initialState,
  reducers: {
    setCurrentStory: (state, action) => {
      state.currentStory = action.payload;
    },
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
    },
    addTimelineNode: (state, action) => {
      state.timeline.push(action.payload);
      state.totalEdits += 1;
      state.streakCount += 1;
      state.lastSaved = new Date().toISOString();
    },
    updateTimelineNode: (state, action) => {
      const index = state.timeline.findIndex(node => node.id === action.payload.id);
      if (index !== -1) {
        state.timeline[index] = { ...state.timeline[index], ...action.payload };
        state.totalEdits += 1;
        state.streakCount += 1;
        state.lastSaved = new Date().toISOString();
      }
    },
    deleteTimelineNode: (state, action) => {
      state.timeline = state.timeline.filter(node => node.id !== action.payload);
      state.totalEdits += 1;
    },
    resetStreak: (state) => {
      state.streakCount = 0;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLifebookData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLifebookData.fulfilled, (state, action) => {
        state.loading = false;
        state.timeline = action.payload.timeline || [];
        state.streakCount = action.payload.streakCount || 0;
        state.totalEdits = action.payload.totalEdits || 0;
      })
      .addCase(getLifebookData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveTimelineNode.fulfilled, (state, action) => {
        // Update the saved node in the timeline
        const index = state.timeline.findIndex(node => node.id === action.payload.id);
        if (index !== -1) {
          state.timeline[index] = action.payload;
        }
        state.lastSaved = new Date().toISOString();
      });
  }
});

export const {
  setCurrentStory,
  setEditMode,
  setSelectedNode,
  addTimelineNode,
  updateTimelineNode,
  deleteTimelineNode,
  resetStreak,
  clearError
} = lifebookSlice.actions;

export const selectLifebook = (state) => state.lifebook;
export const selectTimeline = (state) => state.lifebook.timeline;
export const selectCurrentStory = (state) => state.lifebook.currentStory;
export const selectSelectedNode = (state) => state.lifebook.selectedNode;
export const selectLifebookLoading = (state) => state.lifebook.loading;
export const selectStreakCount = (state) => state.lifebook.streakCount;

export default lifebookSlice.reducer;
