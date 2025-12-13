import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * Returns toast state and functions to show/hide toasts
 */
export const useToast = () => {
  const [toast, setToast] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const showToast = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, open: false }));
  }, []);

  return {
    showToast,
    hideToast,
    toast, // Return toast state so components can use it
  };
};

