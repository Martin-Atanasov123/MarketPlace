import { useState, useCallback } from 'react';

/**
 * Custom hook for managing delete confirmation dialogs
 */
export const useDeleteDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemId, setItemId] = useState(null);

  const openDialog = useCallback((id) => {
    setItemId(id);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setItemId(null);
  }, []);

  return {
    isOpen,
    itemId,
    openDialog,
    closeDialog,
  };
};

