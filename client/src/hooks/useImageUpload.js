import { useState, useCallback } from 'react';
import { MAX_IMAGE_SIZE } from '@/constants';

/**
 * Custom hook for handling image uploads and previews
 */
export const useImageUpload = (initialImageUrl = '') => {
  const [imagePreview, setImagePreview] = useState(initialImageUrl);
  const [error, setError] = useState(null);

  const handleImageFile = useCallback((file) => {
    setError(null);

    if (!file) {
      return Promise.resolve(null);
    }

    // Validate file type
    if (!file.type || !file.type.startsWith('image/')) {
      const errorMsg = 'File must be an image';
      setError(errorMsg);
      return Promise.reject(new Error(errorMsg));
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      const errorMsg = `Image size should be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`;
      setError(errorMsg);
      return Promise.reject(new Error(errorMsg));
    }

    // Validate file size is not 0
    if (file.size === 0) {
      const errorMsg = 'File is empty';
      setError(errorMsg);
      return Promise.reject(new Error(errorMsg));
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        try {
          const base64String = reader.result;
          if (!base64String || typeof base64String !== 'string') {
            throw new Error('Failed to read image file');
          }
          setImagePreview(base64String);
          resolve(base64String);
        } catch (err) {
          const errorMsg = 'Failed to process image file';
          setError(errorMsg);
          reject(new Error(errorMsg));
        }
      };
      
      reader.onerror = () => {
        const errorMsg = 'Failed to read image file';
        setError(errorMsg);
        reject(new Error(errorMsg));
      };
      
      reader.onabort = () => {
        const errorMsg = 'Image reading was aborted';
        setError(errorMsg);
        reject(new Error(errorMsg));
      };
      
      reader.readAsDataURL(file);
    });
  }, []);

  const handleImageUrl = useCallback((url) => {
    setError(null);
    setImagePreview(url || '');
  }, []);

  const resetImage = useCallback(() => {
    setImagePreview('');
    setError(null);
  }, []);

  return {
    imagePreview,
    error,
    handleImageFile,
    handleImageUrl,
    resetImage,
    setImagePreview,
  };
};

