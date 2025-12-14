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
  Chip,
  IconButton,
  TextField,
  Grid,
  Alert,
} from '@mui/material';
import { ArrowBack, Edit, Delete, Favorite, FavoriteBorder, Send } from '@mui/icons-material';
import { toggleFavorite, isFavorite } from '@/utils/favorites';
import { useListings } from '@/hooks/useListings';
import { useComments } from '@/hooks/useComments';
import { useToast } from '@/hooks/useToast';
import { useDeleteDialog } from '@/hooks/useDeleteDialog';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DeleteDialog } from '@/components/DeleteDialog';
import { ListingImage } from '@/components/ListingImage';
import { Toast } from '@/components/Toast';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  const { fetchListing, deleteListing, loading: listingLoading } = useListings();
  const { fetchComments, createComment, deleteComment, loading: commentLoading } = useComments();
  const { showToast, hideToast, toast } = useToast();
  const { isOpen, openDialog, closeDialog } = useDeleteDialog();

  useEffect(() => {
    loadListing();
    loadComments();
  }, [id]);

  const loadListing = async () => {
    try {
      const data = await fetchListing(id);
      setListing(data);
    } catch (error) {
      showToast('Failed to load listing', 'error');
      setTimeout(() => navigate('/catalog'), 2000);
    }
  };

  const loadComments = async () => {
    try {
      const data = await fetchComments(id);
      setComments(data);
    } catch (error) {
      // Error is handled in the hook, just log it
      console.error('Failed to load comments');
    }
  };

  const handleDelete = async () => {
    if (!user || !listing) return;

    try {
      await deleteListing(id);
      showToast('Listing deleted successfully', 'success');
      setTimeout(() => navigate('/catalog'), 1000);
    } catch (error) {
      showToast(error.message || 'Failed to delete listing', 'error');
    } finally {
      closeDialog();
    }
  };

  const toggleLike = () => {
    if (!user || !listing) {
      showToast('Please login to like listings', 'error');
      return;
    }

    try {
      const wasAdded = toggleFavorite(user._id, listing._id);
      showToast(wasAdded ? 'Added to favorites' : 'Removed from favorites', 'success');
      
      // Force re-render - create new object reference so React detects the change
      // The isLiked check in the render will read from localStorage
      setListing({ ...listing });
    } catch (error) {
      console.error('Error toggling favorite:', error);
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

    try {
      const comment = await createComment(id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
      showToast('Comment posted!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to post comment', 'error');
    }
  };

  const handleDeleteComment = async (commentId, commentOwnerId) => {
    if (!user || user._id !== commentOwnerId) return;

    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
      showToast('Comment deleted', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to delete comment', 'error');
    }
  };

  const loading = listingLoading || commentLoading;

  if (loading && !listing) {
    return <LoadingSpinner />;
  }

  if (!listing) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography>Listing not found</Typography>
      </Container>
    );
  }

  const isOwner = user?._id === listing._ownerId;
  const isLiked = user ? isFavorite(user._id, listing._id) : false;

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
              <ListingImage 
                imageUrl={listing.imageUrl} 
                alt={listing.title} 
                height={400}
                borderRadius={1}
              />
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
                    onClick={() => openDialog(id)}
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
                  disabled={commentLoading || !newComment.trim()}
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
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

export default ListingDetails;
