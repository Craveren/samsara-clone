import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWidgets = createAsyncThunk('estateOverviewApp/widgets/getWidgets', async () => {
  const response = await axios.get('/api/dashboards/estate/widgets');
  const data = await response.data;

  return data;
});

const widgetsSlice = createSlice({
  name: 'estateOverviewApp/widgets',
  initialState: null,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWidgets.fulfilled, (state, action) => action.payload);
  },
});

export const selectWidgets = ({ estateOverviewApp }) => estateOverviewApp.widgets;

export default widgetsSlice.reducer;
