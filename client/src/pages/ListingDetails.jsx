import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { ArrowBack, Edit, Delete, Favorite, FavoriteBorder, Send } from '@mui/icons-material';

const API_URL = 'http://localhost:3030';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchListing();
    fetchComments();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`${API_URL}/data/listings/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data._id) {
        throw new Error('Invalid listing data');
      }
      
      setListing(data);
    } catch (error) {
      console.error('Failed to load listing:', error);
      showToast('Failed to load listing', 'error');
      setTimeout(() => navigate('/catalog'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/data/comments?where=listingId%3D%22${id}%22`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments');
    }
  };

  const handleDelete = async () => {
    if (!user || !listing) return;

    try {
      await fetch(`${API_URL}/data/listings/${id}`, {
        method: 'DELETE',
        headers: { 'X-Authorization': user.accessToken },
      });
      showToast('Listing deleted successfully', 'success');
      setTimeout(() => navigate('/catalog'), 1000);
    } catch (error) {
      showToast('Failed to delete listing', 'error');
    }
  };

  const toggleLike = async () => {
    if (!user || !listing) {
      showToast('Please login to like listings', 'error');
      return;
    }

    try {
      const likes = listing.likes || [];
      const isLiked = likes.includes(user._id);
      const updatedLikes = isLiked
        ? likes.filter(id => id !== user._id)
        : [...likes, user._id];

      await fetch(`${API_URL}/data/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken,
        },
        body: JSON.stringify({ ...listing, likes: updatedLikes }),
      });

      setListing({ ...listing, likes: updatedLikes });
      showToast(isLiked ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (error) {
      showToast('Failed to update favorites', 'error');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to comment', 'error');
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`${API_URL}/data/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken,
        },
        body: JSON.stringify({
          listingId: id,
          text: newComment,
          authorEmail: user.email,
        }),
      });

      if (!response.ok) throw new Error('Failed to post comment');

      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment('');
      showToast('Comment posted!', 'success');
    } catch (error) {
      showToast('Failed to post comment', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId, commentOwnerId) => {
    if (!user || user._id !== commentOwnerId) return;

    try {
      await fetch(`${API_URL}/data/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'X-Authorization': user.accessToken },
      });
      setComments(comments.filter(c => c._id !== commentId));
      showToast('Comment deleted', 'success');
    } catch (error) {
      showToast('Failed to delete comment', 'error');
    }
  };

  const showToast = (message, severity) => {
    setToast({ open: true, message, severity });
  };

  if (loading) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography>Listing not found</Typography>
      </Container>
    );
  }

  const isOwner = user?._id === listing._ownerId;
  const isLiked = listing.likes?.includes(user?._id || '');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Image */}
            <Grid item xs={12} md={6}>
              <CardMedia
                component="div"
                sx={{
                  height: 400,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
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
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }}
                  />
                ) : (
                  <Typography color="text.secondary">No image</Typography>
                )}
              </CardMedia>
            </Grid>

            {/* Details */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Chip label={listing.category} sx={{ mb: 1 }} />
                  <Typography variant="h4" component="h1" fontWeight="bold">
                    {listing.title}
                  </Typography>
                </Box>
                {user && (
                  <IconButton onClick={toggleLike} size="large">
                    {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                )}
              </Box>

              <Typography variant="h3" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
                ${listing.price}
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Description</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {listing.description}
                </Typography>
              </Box>

              {/* Actions */}
              {isOwner && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    component={Link}
                    to={`/edit/${listing._id}`}
                    fullWidth
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                    fullWidth
                  >
                    Delete
                  </Button>
                </Box>
              )}

              {!user && (
                <Alert severity="info">
                  Want to contact the seller?{' '}
                  <Link to="/login">Login to continue</Link>
                </Alert>
              )}
            </Grid>
          </Grid>

          {/* Comments Section */}
          <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Comments ({comments.length})
            </Typography>

            {user ? (
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<Send />}
                  disabled={submittingComment || !newComment.trim()}
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </Box>
            ) : (
              <Alert severity="info" sx={{ mb: 4 }}>
                <Link to="/login">Login to leave a comment</Link>
              </Alert>
            )}

            {comments.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                No comments yet
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {comments.map((comment) => (
                  <Card key={comment._id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {comment.authorEmail}
                        </Typography>
                        {user && user._id === comment._ownerId && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteComment(comment._id, comment._ownerId)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {comment.text}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

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

export default ListingDetails;
