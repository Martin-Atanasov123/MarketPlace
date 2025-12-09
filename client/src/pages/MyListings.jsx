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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

const API_URL = 'http://localhost:3030';

const MyListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!user) {
      showToast('Please login to view your listings', 'error');
      navigate('/login');
      return;
    }
    fetchMyListings();
  }, [user, navigate]);

  const fetchMyListings = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `${API_URL}/data/listings?where=_ownerId%3D%22${user._id}%22`
      );
      const data = await response.json();
      setListings(data);
    } catch (error) {
      showToast('Failed to load your listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedListingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!user || !selectedListingId) return;

    try {
      await fetch(`${API_URL}/data/listings/${selectedListingId}`, {
        method: 'DELETE',
        headers: { 'X-Authorization': user.accessToken },
      });
      setListings(listings.filter(l => l._id !== selectedListingId));
      showToast('Listing deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete listing', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedListingId(null);
    }
  };

  const showToast = (message, severity) => {
    setToast({ open: true, message, severity });
  };

  if (loading) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography>Loading your listings...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold">
          My Listings
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          component={Link} 
          to="/create"
          size="large"
        >
          New Listing
        </Button>
      </Box>

      {listings.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              You haven't posted any listings yet
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/create" 
              sx={{ mt: 2 }}
            >
              Create Your First Listing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                      onClick={() => handleDeleteClick(listing._id)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Listing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default MyListings;