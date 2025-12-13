import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Pagination,
} from '@mui/material';
import { Search, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { toggleFavorite, isFavorite } from '@/utils/favorites';
import { useListings } from '@/hooks/useListings';
import { useToast } from '@/hooks/useToast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ListingImage } from '@/components/ListingImage';
import { Toast } from '@/components/Toast';
import { LISTING_CATEGORIES } from '@/constants';

const Catalog = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 2 columns × 3 rows = 6 items per page
  const { user } = useAuth();
  const { fetchListings, loading } = useListings();
  const { showToast, hideToast, toast } = useToast();

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    // Only filter when listings array is ready
    if (Array.isArray(listings)) {
      filterListings();
    }
  }, [searchTerm, selectedCategory, listings]);

  const loadListings = async () => {
    try {
      const data = await fetchListings();
      setListings(data);
    } catch (error) {
      showToast('Failed to load listings', 'error');
      setListings([]);
    }
  };

  const filterListings = () => {
    if (!Array.isArray(listings) || listings.length === 0) {
      setFilteredListings([]);
      return;
    }

    let filtered = listings;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing => listing && listing.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing &&
        (listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredListings(filtered);
    setCurrentPage(1);
  };

  const toggleLike = (listingId) => {
    if (!user) {
      showToast('Please login to like listings', 'error');
      return;
    }

    try {
      const wasAdded = toggleFavorite(user._id, listingId);
      showToast(wasAdded ? 'Added to favorites' : 'Removed from favorites', 'success');
      
      // Trigger a re-render by creating new array references
      // The isLiked check in the render will read from localStorage
      setListings([...listings]);
      setFilteredListings([...filteredListings]);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('Failed to update favorites', 'error');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = filteredListings.slice(startIndex, endIndex);

  if (loading) {
    return <LoadingSpinner message="Loading listings..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Browse Listings
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {LISTING_CATEGORIES.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No listings found
          </Typography>
          {user && (
            <Button variant="contained" component={Link} to="/create" sx={{ mt: 2 }}>
              Post Your First Ad
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentListings.map((listing) => {
              if (!listing || !listing._id) return null;
              const isLiked = user ? isFavorite(user._id, listing._id) : false;
              return (
                <Grid item xs={12} sm={6} md={6} key={listing._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <ListingImage imageUrl={listing.imageUrl} alt={listing.title} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h3" noWrap sx={{ flexGrow: 1, mr: 1 }}>
                          {listing.title}
                        </Typography>
                        {user && (
                          <IconButton size="small" onClick={() => toggleLike(listing._id)}>
                            {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                          </IconButton>
                        )}
                      </Box>
                      <Chip label={listing.category || 'Uncategorized'} size="small" sx={{ mb: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {listing.description ? `${listing.description.substring(0, 80)}...` : 'No description'}
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
              );
            })}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      <Toast toast={toast} onClose={hideToast} />
    </Container>
  );
};

export default Catalog;
