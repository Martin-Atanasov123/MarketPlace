import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from './constants';

/**
 * Custom hook for managing comment operations
 * Provides functions to fetch, create, and delete comments
 */
export const useComments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch comments for a specific listing
   */
  const fetchComments = useCallback(async (listingId) => {
    if (!listingId || typeof listingId !== 'string') {
      console.warn('Invalid listing ID provided to fetchComments');
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/data/comments?where=listingId%3D%22${encodeURIComponent(listingId)}%22`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage = err.message || 'Failed to load comments';
      setError(errorMessage);
      console.error('Failed to load comments:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new comment
   */
  const createComment = useCallback(async (listingId, text) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    if (!listingId || typeof listingId !== 'string') {
      throw new Error('Invalid listing ID');
    }

    if (!text || typeof text !== 'string' || !text.trim()) {
      throw new Error('Comment text is required');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/data/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken,
        },
        body: JSON.stringify({
          listingId,
          text: text.trim(),
          authorEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Failed to post comment';
        throw new Error(errorMessage);
      }

      const comment = await response.json();
      return comment;
    } catch (err) {
      const errorMessage = err.message || 'Failed to post comment';
      setError(errorMessage);
      console.error('Error creating comment:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Delete a comment
   */
  const deleteComment = useCallback(async (commentId) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    if (!commentId || typeof commentId !== 'string') {
      throw new Error('Invalid comment ID');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/data/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'X-Authorization': user.accessToken },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Comment not found');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to delete this comment');
        }
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to delete comment (${response.status})`;
        throw new Error(errorMessage);
      }

      return true;
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete comment';
      setError(errorMessage);
      console.error('Error deleting comment:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    fetchComments,
    createComment,
    deleteComment,
  };
};

