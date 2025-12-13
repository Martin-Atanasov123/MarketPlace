import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from './constants';

/**
 * Custom hook for managing listing operations
 * Provides functions to fetch, create, update, and delete listings
 */
export const useListings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all listings
   */
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/data/listings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        // Ensure all listings have a likes array initialized
        const listingsWithLikes = data.map(listing => ({
          ...listing,
          likes: Array.isArray(listing.likes) ? listing.likes : []
        }));
        return listingsWithLikes;
      } else {
        console.error('Invalid data format received:', data);
        return [];
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to load listings';
      setError(errorMessage);
      console.error('Failed to load listings:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single listing by ID
   */
  const fetchListing = useCallback(async (id) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid listing ID');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/data/listings/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Listing not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data._id) {
        throw new Error('Invalid listing data received from server');
      }
      
      // Ensure likes array is initialized
      const listingWithLikes = {
        ...data,
        likes: Array.isArray(data.likes) ? data.likes : []
      };
      
      return listingWithLikes;
    } catch (err) {
      const errorMessage = err.message || 'Failed to load listing';
      setError(errorMessage);
      console.error('Failed to load listing:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch listings owned by the current user
   */
  const fetchMyListings = useCallback(async () => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/data/listings?where=_ownerId%3D%22${user._id}%22`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const errorMessage = err.message || 'Failed to load your listings';
      setError(errorMessage);
      console.error('Failed to load listings:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Create a new listing
   */
  const createListing = useCallback(async (listingData) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    if (!listingData || typeof listingData !== 'object') {
      throw new Error('Invalid listing data provided');
    }

    setLoading(true);
    setError(null);
    try {
      // Validate required fields
      if (!listingData.title || !listingData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!listingData.description || !listingData.description.trim()) {
        throw new Error('Description is required');
      }
      if (listingData.price === undefined || listingData.price === null || isNaN(parseFloat(listingData.price))) {
        throw new Error('Valid price is required');
      }

      const priceValue = parseFloat(listingData.price);
      if (priceValue < 0) {
        throw new Error('Price cannot be negative');
      }

      const payload = {
        title: String(listingData.title).trim(),
        description: String(listingData.description).trim(),
        price: priceValue,
        category: listingData.category || 'Other',
        imageUrl: listingData.imageUrl || '',
        likes: [],
      };

      const response = await fetch(`${API_URL}/data/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Server error (${response.status})`;
        
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create listing';
      setError(errorMessage);
      console.error('Error creating listing:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Update an existing listing
   */
  const updateListing = useCallback(async (id, listingData) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    if (!id || typeof id !== 'string') {
      throw new Error('Invalid listing ID');
    }

    if (!listingData || typeof listingData !== 'object') {
      throw new Error('Invalid listing data provided');
    }

    setLoading(true);
    setError(null);
    try {
      // Validate required fields
      if (!listingData.title || !listingData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!listingData.description || !listingData.description.trim()) {
        throw new Error('Description is required');
      }
      if (listingData.price === undefined || listingData.price === null || isNaN(parseFloat(listingData.price))) {
        throw new Error('Valid price is required');
      }

      const priceValue = parseFloat(listingData.price);
      if (priceValue < 0) {
        throw new Error('Price cannot be negative');
      }

      const payload = {
        title: String(listingData.title).trim(),
        description: String(listingData.description).trim(),
        price: priceValue,
        category: listingData.category || 'Other',
        imageUrl: listingData.imageUrl || '',
        likes: Array.isArray(listingData.likes) ? listingData.likes : [],
      };

      const response = await fetch(`${API_URL}/data/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Server error (${response.status})`;
        
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update listing';
      setError(errorMessage);
      console.error('Error updating listing:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Delete a listing
   */
  const deleteListing = useCallback(async (id) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    if (!id || typeof id !== 'string') {
      throw new Error('Invalid listing ID');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/data/listings/${id}`, {
        method: 'DELETE',
        headers: { 'X-Authorization': user.accessToken },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Listing not found');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to delete this listing');
        }
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to delete listing (${response.status})`;
        throw new Error(errorMessage);
      }

      return true;
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete listing';
      setError(errorMessage);
      console.error('Error deleting listing:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    fetchListings,
    fetchListing,
    fetchMyListings,
    createListing,
    updateListing,
    deleteListing,
  };
};

