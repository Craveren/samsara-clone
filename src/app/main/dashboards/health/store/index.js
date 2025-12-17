import { combineReducers } from '@reduxjs/toolkit';
import widgets from './widgetsSlice';
import estateHealth from './estateHealthSlice';

const reducer = combineReducers({
  widgets,
  estateHealth,
});

export default reducer;
