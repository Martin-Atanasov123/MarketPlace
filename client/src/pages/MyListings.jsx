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
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useListings } from '@/hooks/useListings';
import { useToast } from '@/hooks/useToast';
import { useDeleteDialog } from '@/hooks/useDeleteDialog';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DeleteDialog } from '@/components/DeleteDialog';
import { ListingImage } from '@/components/ListingImage';
import { Toast } from '@/components/Toast';

const MyListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  
  const { fetchMyListings, deleteListing, loading } = useListings();
  const { showToast, hideToast, toast } = useToast();
  const { isOpen, itemId, openDialog, closeDialog } = useDeleteDialog();

  useEffect(() => {
    if (!user) {
      showToast('Please login to view your listings', 'error');
      navigate('/login');
      return;
    }
    loadMyListings();
  }, [user, navigate]);

  const loadMyListings = async () => {
    if (!user) return;

    try {
      const data = await fetchMyListings();
      setListings(data);
    } catch (error) {
      showToast('Failed to load your listings', 'error');
    }
  };

  const handleDelete = async () => {
    if (!user || !itemId) return;

    try {
      await deleteListing(itemId);
      setListings(listings.filter(l => l._id !== itemId));
      showToast('Listing deleted successfully', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to delete listing', 'error');
    } finally {
      closeDialog();
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your listings..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold">
          My Products
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          component={Link} 
          to="/create"
          size="large"
        >
          Create New 
        </Button>
      </Box>

      {listings.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              You haven't posted any products yet
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/create" 
              sx={{ mt: 2 }}
            >
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <ListingImage imageUrl={listing.imageUrl} alt={listing.title} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip label={listing.category} size="small" sx={{ mb: 1 }} />
                  <Typography variant="h6" gutterBottom noWrap>
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {listing.description.substring(0, 60)}...
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    ${listing.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Visibility />}
                    component={Link}
                    to={`/listing/${listing._id}`}
                  >
                    View
                  </Button>
                  <Box>
                    <IconButton
                      size="small"
                      component={Link}
                      to={`/edit/${listing._id}`}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDialog(listing._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <DeleteDialog
        open={isOpen}
        onClose={closeDialog}
        onConfirm={handleDelete}
        title="Delete Listing"
      />
      <Toast toast={toast} onClose={hideToast} />
    </Container>
  );
};

export default MyListings;
