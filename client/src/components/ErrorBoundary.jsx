import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container sx={{ py: 6, textAlign: 'center' }}>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We encountered an unexpected error. Please try refreshing the page.
            </Typography>
            <Button
              variant="contained"
              onClick={this.handleReset}
              sx={{ mr: 2 }}
            >
              Go to Home
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1, textAlign: 'left' }}>
                <Typography variant="caption" component="pre" sx={{ overflow: 'auto' }}>
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

