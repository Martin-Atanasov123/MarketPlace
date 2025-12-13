import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { getFavorites, removeFavorite } from '@/utils/favorites';
import { useListings } from '@/hooks/useListings';
import { useToast } from '@/hooks/useToast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ListingImage } from '@/components/ListingImage';
import { Toast } from '@/components/Toast';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  
  const { fetchListings, loading } = useListings();
  const { showToast, hideToast, toast } = useToast();

  useEffect(() => {
    if (!user) {
      showToast('Please login to view your favorites', 'error');
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [user, navigate]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      // Get favorite IDs from localStorage
      const favoriteIds = getFavorites(user._id);
      
      if (favoriteIds.length === 0) {
        setListings([]);
        return;
      }

      // Fetch all listings from server
      const allListings = await fetchListings();
      
      // Filter to only show favorites
      const favorites = allListings.filter(listing => {
        if (!listing || !listing._id) return false;
        return favoriteIds.includes(listing._id);
      });

      setListings(favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      showToast('Failed to load favorites', 'error');
    }
  };

  const handleRemoveFavorite = (listingId) => {
    if (!user) return;

    try {
      removeFavorite(user._id, listingId);
      // Remove from local state
      setListings(listings.filter(l => l._id !== listingId));
      showToast('Removed from favorites', 'success');
    } catch (error) {
      console.error('Error removing favorite:', error);
      showToast('Failed to remove from favorites', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your favorites..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Favorite color="error" sx={{ fontSize: 32 }} />
          <Typography variant="h3" component="h1" fontWeight="bold">
            My Favorites
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {listings.length} {listings.length === 1 ? 'item' : 'items'} saved
        </Typography>
      </Box>

      {listings.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <FavoriteBorder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" gutterBottom>
              You haven't saved any favorites yet
            </Typography>
            <Button variant="contained" component={Link} to="/catalog" sx={{ mt: 2 }}>
              Browse Listings
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.paper' }, zIndex: 1 }}
                  onClick={() => handleRemoveFavorite(listing._id)}
                >
                  <Favorite color="error" />
                </IconButton>
                <ListingImage imageUrl={listing.imageUrl} alt={listing.title} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip label={listing.category} size="small" sx={{ mb: 1 }} />
                  <Typography variant="h6" gutterBottom noWrap>
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {listing.description.substring(0, 80)}...
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    ${listing.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    to={`/listing/${listing._id}`}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Toast toast={toast} onClose={hideToast} />
    </Container>
  );
};

export default Favorites;
