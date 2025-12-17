import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getErrorMessage, getSuccessMessage } from 'app/utils/toastMessages';

/**
 * Hook to show toast messages using the Fuse message system
 * Integrates with the existing Redux message slice
 */
export function useToastMessage() {
  const dispatch = useDispatch();

  const showSuccess = useCallback(
    (message, options = {}) => {
      dispatch(
        showMessage({
          message,
          variant: 'success',
          ...options,
        })
      );
    },
    [dispatch]
  );

  const showError = useCallback(
    (error, options = {}) => {
      const message = typeof error === 'string' ? error : getErrorMessage(error);
      dispatch(
        showMessage({
          message,
          variant: 'error',
          ...options,
        })
      );
    },
    [dispatch]
  );

  const showWarning = useCallback(
    (message, options = {}) => {
      dispatch(
        showMessage({
          message,
          variant: 'warning',
          ...options,
        })
      );
    },
    [dispatch]
  );

  const showInfo = useCallback(
    (message, options = {}) => {
      dispatch(
        showMessage({
          message,
          variant: 'info',
          ...options,
        })
      );
    },
    [dispatch]
  );

  const showActionSuccess = useCallback(
    (action, resource = 'item', options = {}) => {
      showSuccess(getSuccessMessage(action, resource), options);
    },
    [showSuccess]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showActionSuccess,
    // Alias for convenience
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  };
}

export default useToastMessage;

