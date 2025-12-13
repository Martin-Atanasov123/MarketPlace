import { Snackbar, Alert } from '@mui/material';
import { TOAST_DURATION } from '@/constants';

/**
 * Reusable Toast notification component
 */
export const Toast = ({ toast, onClose }) => {
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={TOAST_DURATION}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity={toast.severity} onClose={onClose}>
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

