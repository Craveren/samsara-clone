import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getNotifications = createAsyncThunk('notificationPanel/getData', async () => {
  const response = await axios.get('/api/notifications');
  const data = await response.data;

  return data;
});

export const dismissAll = createAsyncThunk('notificationPanel/dismissAll', async () => {
  const response = await axios.delete('/api/notifications');
  await response.data;

  return true;
});

export const dismissItem = createAsyncThunk('notificationPanel/dismissItem', async (id) => {
  const response = await axios.delete(`/api/notifications/${id}`);
  await response.data;

  return id;
});

export const addNotification = createAsyncThunk(
  'notificationPanel/addNotification',
  async (item) => {
    const response = await axios.post(`/api/notifications`, { ...item });
    const data = await response.data;

    return data;
  }
);

const notificationsAdapter = createEntityAdapter({});

const initialState = notificationsAdapter.upsertMany(notificationsAdapter.getInitialState(), []);

export const { selectAll: selectNotifications, selectById: selectNotificationsById } =
  notificationsAdapter.getSelectors((state) => state.notificationPanel.data);

const dataSlice = createSlice({
  name: 'notificationPanel/data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(dismissItem.fulfilled, (state, action) =>
        notificationsAdapter.removeOne(state, action.payload)
      )
      .addCase(dismissAll.fulfilled, (state, action) => notificationsAdapter.removeAll(state))
      .addCase(getNotifications.fulfilled, (state, action) =>
        notificationsAdapter.addMany(state, action.payload)
      )
      .addCase(addNotification.fulfilled, (state, action) =>
        notificationsAdapter.addOne(state, action.payload)
      );
  },
});

export default dataSlice.reducer;
