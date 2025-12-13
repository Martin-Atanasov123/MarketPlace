import { Container, Typography, CircularProgress, Box } from '@mui/material';

/**
 * Reusable loading spinner component
 */
export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Container sx={{ py: 6, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress />
        <Typography>{message}</Typography>
      </Box>
    </Container>
  );
};

