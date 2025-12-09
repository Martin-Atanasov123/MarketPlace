import { seedListings } from '@/data/seedListings';

const API_URL = 'http://localhost:3030';
const SEED_FLAG_KEY = 'marketplace_data_seeded';

export const seedDatabase = async (user) => {
  // Check if data has already been seeded
  if (localStorage.getItem(SEED_FLAG_KEY)) {
    return;
  }

  if (!user || !user.accessToken) {
    return;
  }

  try {
    // Check if there are any existing listings
    const response = await fetch(`${API_URL}/data/listings`);
    
    if (!response.ok) {
      console.warn('Server not ready for seeding:', response.status);
      return;
    }
    
    const existingListings = await response.json();
    
    // Ensure response is an array
    if (!Array.isArray(existingListings)) {
      console.warn('Invalid listings data format');
      return;
    }

    // Only seed if there are fewer than 5 listings
    if (existingListings.length >= 5) {
      localStorage.setItem(SEED_FLAG_KEY, 'true');
      return;
    }

    // Create seed listings
    const promises = seedListings.map(listing =>
      fetch(`${API_URL}/data/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken,
        },
        body: JSON.stringify({
          ...listing,
          likes: [],
        }),
      })
    );

    await Promise.all(promises);
    localStorage.setItem(SEED_FLAG_KEY, 'true');
    console.log('Database seeded successfully with sample listings');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
};
