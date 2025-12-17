/**
 * Centralized toast message utilities
 * Provides consistent, user-friendly error and success messages
 */

export const ToastMessages = {
  // Authentication messages
  auth: {
    loginSuccess: 'Welcome back! Redirecting to your dashboard...',
    loginError: 'Invalid email or password. Please try again.',
    logoutSuccess: 'You have been logged out successfully.',
    sessionExpired: 'Your session has expired. Please log in again.',
    unauthorized: 'You do not have permission to access this resource.',
    pinCreated: 'PIN created successfully!',
    pinInvalid: 'Invalid PIN. Please try again.',
    pinRequired: 'Please enter your PIN to continue.',
  },

  // Document messages
  documents: {
    uploadSuccess: 'Document uploaded successfully!',
    uploadError: 'Failed to upload document. Please try again.',
    deleteSuccess: 'Document deleted successfully.',
    deleteError: 'Failed to delete document. Please try again.',
    saveSuccess: 'Document saved successfully!',
    saveError: 'Failed to save document. Please check your connection.',
    fileTooLarge: 'File size exceeds the maximum limit of 10MB.',
    invalidFileType: 'Invalid file type. Please upload a supported file format.',
  },

  // Task messages
  tasks: {
    createSuccess: 'Task created successfully!',
    createError: 'Failed to create task. Please try again.',
    updateSuccess: 'Task updated successfully!',
    updateError: 'Failed to update task. Please try again.',
    deleteSuccess: 'Task deleted successfully.',
    deleteError: 'Failed to delete task. Please try again.',
    completeSuccess: 'Task marked as complete!',
  },

  // Legacy/Story messages
  legacy: {
    storySaved: 'Story saved successfully!',
    storyError: 'Failed to save story. Please try again.',
    imageAdded: 'Image added to your story.',
    imageError: 'Failed to add image. Please try again.',
    timelineUpdated: 'Timeline updated successfully!',
  },

  // Financial messages
  financial: {
    accountAdded: 'Account added successfully!',
    accountError: 'Failed to add account. Please try again.',
    transactionAdded: 'Transaction recorded successfully!',
    transactionError: 'Failed to record transaction. Please try again.',
    syncSuccess: 'Accounts synced successfully!',
    syncError: 'Failed to sync accounts. Please check your connection.',
  },

  // People/Beneficiaries messages
  people: {
    added: 'Person added successfully!',
    updated: 'Person updated successfully!',
    deleted: 'Person removed successfully!',
    error: 'An error occurred. Please try again.',
    inviteSent: 'Invitation sent successfully!',
    inviteError: 'Failed to send invitation. Please try again.',
  },

  // General messages
  general: {
    saveSuccess: 'Changes saved successfully!',
    saveError: 'Failed to save changes. Please try again.',
    deleteSuccess: 'Item deleted successfully.',
    deleteError: 'Failed to delete item. Please try again.',
    networkError: 'Network error. Please check your connection and try again.',
    serverError: 'Server error. Please try again later.',
    unknownError: 'An unexpected error occurred. Please try again.',
    loading: 'Loading...',
    noData: 'No data available.',
    searchNoResults: 'No results found. Try different search terms.',
  },

  // Form validation messages
  validation: {
    required: (field) => `${field} is required.`,
    email: 'Please enter a valid email address.',
    password: 'Password must be at least 8 characters with uppercase, lowercase, and number.',
    passwordMatch: 'Passwords do not match.',
    pin: 'PIN must be exactly 4 digits.',
    phone: 'Please enter a valid phone number.',
    url: 'Please enter a valid URL.',
    fileSize: (maxSize) => `File size must be less than ${maxSize}MB.`,
    fileType: (types) => `File type must be one of: ${types.join(', ')}.`,
  },
};

/**
 * Get user-friendly error message from error object
 */
export function getErrorMessage(error, defaultMessage = ToastMessages.general.unknownError) {
  if (!error) return defaultMessage;

  // Handle API errors
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;

    if (message) return message;

    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return ToastMessages.auth.sessionExpired;
      case 403:
        return ToastMessages.auth.unauthorized;
      case 404:
        return 'Resource not found.';
      case 409:
        return 'This resource already exists.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return ToastMessages.general.serverError;
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return defaultMessage;
    }
  }

  // Handle network errors
  if (error.message === 'Network Error' || error.code === 'NETWORK_ERROR') {
    return ToastMessages.general.networkError;
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Return error message if available
  if (error.message) {
    return error.message;
  }

  return defaultMessage;
}

/**
 * Get success message for an action
 */
export function getSuccessMessage(action, resource = 'item') {
  const messages = {
    create: `${resource} created successfully!`,
    update: `${resource} updated successfully!`,
    delete: `${resource} deleted successfully!`,
    save: 'Changes saved successfully!',
    upload: 'File uploaded successfully!',
    download: 'File downloaded successfully!',
    send: 'Message sent successfully!',
  };

  return messages[action] || ToastMessages.general.saveSuccess;
}

export default ToastMessages;

