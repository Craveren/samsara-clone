import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // In production, send to error tracking service
      // Example: Sentry.captureException(error, { extra: errorInfo });
    } else {
      // In development, log to console
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            bgcolor: 'background.default',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              maxWidth: 600,
              width: '100%',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'error.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <FuseSvgIcon size={40} color="error">
                heroicons-solid:exclamation-triangle
              </FuseSvgIcon>
            </Box>

            <Typography variant="h4" component="h1" gutterBottom>
              Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  mb: 3,
                  textAlign: 'left',
                }}
              >
                <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleReset}
                startIcon={<FuseSvgIcon>heroicons-solid:arrow-path</FuseSvgIcon>}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                onClick={this.handleReload}
                startIcon={<FuseSvgIcon>heroicons-solid:arrow-clockwise</FuseSvgIcon>}
              >
                Reload Page
              </Button>
              <Button
                variant="text"
                onClick={() => (window.location.href = '/')}
                startIcon={<FuseSvgIcon>heroicons-solid:home</FuseSvgIcon>}
              >
                Go Home
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

