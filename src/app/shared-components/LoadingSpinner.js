import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading';

/**
 * Enhanced loading component with optional message
 */
const LoadingSpinner = ({ message, fullScreen = false, size = 40 }) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: fullScreen ? 0 : 3,
        minHeight: fullScreen ? '100vh' : '200px',
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return content;
  }

  return content;
};

/**
 * Full-screen loading component
 */
export const FullScreenLoader = ({ message = 'Loading...' }) => (
  <LoadingSpinner message={message} fullScreen size={60} />
);

/**
 * Inline loading component
 */
export const InlineLoader = ({ message }) => (
  <LoadingSpinner message={message} fullScreen={false} size={30} />
);

/**
 * Legacy FuseLoading wrapper for backward compatibility
 */
export const FuseLoadingWrapper = () => <FuseLoading />;

export default LoadingSpinner;

