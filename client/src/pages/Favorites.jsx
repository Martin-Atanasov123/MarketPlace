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
  CardMedia,
  Chip,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { getFavorites, removeFavorite } from '@/utils/favorites';

const API_URL = 'http://localhost:3030';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!user) {
      showToast('Please login to view your favorites', 'error');
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      // Get favorite IDs from localStorage
      const favoriteIds = getFavorites(user._id);
      
      if (favoriteIds.length === 0) {
        setListings([]);
        setLoading(false);
        return;
      }

      // Fetch all listings from server
      const response = await fetch(`${API_URL}/data/listings`);
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      const listingsArray = Array.isArray(data) ? data : [];
      
      // Filter to only show favorites
      const favorites = listingsArray.filter(listing => {
        if (!listing || !listing._id) return false;
        return favoriteIds.includes(listing._id);
      });

      setListings(favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      showToast('Failed to load favorites', 'error');
    } finally {
      setLoading(false);
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

  const showToast = (message, severity) => {
    setToast({ open: true, message, severity });
  };

  if (loading) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography>Loading your favorites...</Typography>
      </Container>
    );
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
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {listing.imageUrl ? (
                    <Box
                      component="img"
                      src={listing.imageUrl}
                      alt={listing.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Typography color="text.secondary">No image</Typography>
                  )}
                </CardMedia>
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

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Favorites;
