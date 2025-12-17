import { combineReducers } from '@reduxjs/toolkit';
import fuse from './fuse';
import i18n from './i18nSlice';
import user from './userSlice';
import lifebook from './lifebookSlice';
import documentVault from './documentVaultSlice';
import beneficiaryTree from './beneficiaryTreeSlice';
import estatePlanning from './estatePlanningSlice';
import automation from './automationSlice';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse,
    i18n,
    user,
    lifebook,
    documentVault,
    beneficiaryTree,
    estatePlanning,
    automation,
    ...asyncReducers,
  });

  /*
	Reset the redux store when user logged out
	 */
  if (action.type === 'user/userLoggedOut') {
    // state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
