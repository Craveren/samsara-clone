import { combineReducers } from '@reduxjs/toolkit';
import widgets from './widgetsSlice';
import estateStatus from './estateStatusSlice';

const reducer = combineReducers({
  widgets,
  estateStatus,
});

export default reducer;
