import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWidgets = createAsyncThunk('estateHealthApp/widgets/getWidgets', async () => {
  const response = await axios.get('/api/dashboards/estate-health/widgets');
  const data = await response.data;

  return data;
});

const widgetsSlice = createSlice({
  name: 'estateHealthApp/widgets',
  initialState: null,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWidgets.fulfilled, (state, action) => action.payload);
  },
});

export const selectWidgets = ({ estateHealthApp }) => estateHealthApp.widgets;

export default widgetsSlice.reducer;
