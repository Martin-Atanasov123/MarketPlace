import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from './constants';

/**
 * Custom hook for managing user profile operations
 * Provides functions to update user email and password
 */
export const useUser = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Update user email
   */
  const updateEmail = useCallback(async (email) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken,
        },
        body: JSON.stringify({ email: email.trim() }),
        
        
      });

      if (!response.ok) {
        if (response.status === 404 || response.status === 405) {
          throw new Error('Email update is not available. Please contact support.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update email');
      }

      // if (response.status === 204) {
      //   throw new Error('Email update is not currently supported.');
      // }

      // const updatedUserData = await response.json();
      const updatedUser = { ...user, email: email.trim() };
      updateUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update email';
      setError(errorMessage);
      console.error('Error updating email:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, updateUser]);

  /**
   * Update user password
   */
  const updatePassword = useCallback(async (password) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    if (!password || !password.trim()) {
      throw new Error('Password is required');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken,
        },
        body: JSON.stringify({ password: password.trim() }),
      });

      if (!response.ok) {
        if (response.status === 404 || response.status === 405) {
          throw new Error('Password update is not available. Please contact support.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update password');
      }

      return true;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update password';
      setError(errorMessage);
      console.error('Error updating password:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Validate password strength
   */
  const validatePassword = useCallback((password) => {
    const errors = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return errors;
  }, []);

  return {
    loading,
    error,
    updateEmail,
    updatePassword,
    validatePassword,
  };
};

