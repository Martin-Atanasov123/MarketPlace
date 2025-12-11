/**
 * Utility functions for managing favorites in localStorage
 * Favorites are stored per user to allow multiple users on the same device
 */

const getFavoritesKey = (userId) => `favorites_${userId}`;

/**
 * Get all favorite listing IDs for a user
 * @param {string} userId - The user's ID
 * @returns {string[]} Array of favorite listing IDs
 */
export const getFavorites = (userId) => {
  if (!userId) return [];
  
  try {
    const favoritesJson = localStorage.getItem(getFavoritesKey(userId));
    if (!favoritesJson) return [];
    
    const favorites = JSON.parse(favoritesJson);
    return Array.isArray(favorites) ? favorites : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

/**
 * Check if a listing is favorited by a user
 * @param {string} userId - The user's ID
 * @param {string} listingId - The listing's ID
 * @returns {boolean} True if the listing is favorited
 */
export const isFavorite = (userId, listingId) => {
  const favorites = getFavorites(userId);
  return favorites.includes(listingId);
};

/**
 * Add a listing to favorites
 * @param {string} userId - The user's ID
 * @param {string} listingId - The listing's ID
 */
export const addFavorite = (userId, listingId) => {
  if (!userId || !listingId) return;
  
  const favorites = getFavorites(userId);
  if (!favorites.includes(listingId)) {
    favorites.push(listingId);
    localStorage.setItem(getFavoritesKey(userId), JSON.stringify(favorites));
  }
};

/**
 * Remove a listing from favorites
 * @param {string} userId - The user's ID
 * @param {string} listingId - The listing's ID
 */
export const removeFavorite = (userId, listingId) => {
  if (!userId || !listingId) return;
  
  const favorites = getFavorites(userId);
  const updatedFavorites = favorites.filter(id => id !== listingId);
  localStorage.setItem(getFavoritesKey(userId), JSON.stringify(updatedFavorites));
};

/**
 * Toggle favorite status of a listing
 * @param {string} userId - The user's ID
 * @param {string} listingId - The listing's ID
 * @returns {boolean} True if added, false if removed
 */
export const toggleFavorite = (userId, listingId) => {
  if (!userId || !listingId) return false;
  
  const isFav = isFavorite(userId, listingId);
  if (isFav) {
    removeFavorite(userId, listingId);
    return false;
  } else {
    addFavorite(userId, listingId);
    return true;
  }
};

/**
 * Clear all favorites for a user (useful on logout)
 * @param {string} userId - The user's ID
 */
export const clearFavorites = (userId) => {
  if (!userId) return;
  localStorage.removeItem(getFavoritesKey(userId));
};

