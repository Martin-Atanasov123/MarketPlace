import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { useListings } from '@/hooks/useListings';
import { useToast } from '@/hooks/useToast';
import { useImageUpload } from '@/hooks/useImageUpload';
import { validateListingForm } from '@/utils/validation';
import { Toast } from '@/components/Toast';
import { LISTING_CATEGORIES, MAX_IMAGE_SIZE } from '@/constants';

const CreateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: LISTING_CATEGORIES[0],
    imageUrl: '',
  });
  
  const { fetchListing, createListing, updateListing, loading } = useListings();
  const { showToast, hideToast, toast } = useToast();
  const { imagePreview, handleImageFile, handleImageUrl, setImagePreview } = useImageUpload();

  useEffect(() => {
    if (!user) {
      showToast('Please login to create listings', 'error');
      navigate('/login');
      return;
    }

    if (id) {
      loadListing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, navigate]);

  const loadListing = async () => {
    if (!id || !user) return;
    
    try {
      const data = await fetchListing(id);

      if (data._ownerId !== user._id) {
        showToast('You can only edit your own listings', 'error');
        navigate('/catalog');
        return;
      }

      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price ? data.price.toString() : '',
        category: data.category || LISTING_CATEGORIES[0],
        imageUrl: data.imageUrl || '',
      });
      setImagePreview(data.imageUrl || '');
    } catch (error) {
      showToast(error.message || 'Failed to load listing', 'error');
      navigate('/catalog');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64String = await handleImageFile(file);
        if (base64String) {
          setFormData({ ...formData, imageUrl: base64String });
        }
      } catch (error) {
        showToast(error.message || `Image size should be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`, 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to create listings', 'error');
      navigate('/login');
      return;
    }

    // Validate form data
    const validation = validateListingForm(formData);
    if (!validation.isValid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    const priceValue = parseFloat(formData.price);

    try {
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: priceValue,
        category: formData.category,
        imageUrl: formData.imageUrl || imagePreview || '',
      };

      if (id) {
        await updateListing(id, listingData);
        showToast('Listing updated successfully!', 'success');
      } else {
        await createListing(listingData);
        showToast('Listing created successfully!', 'success');
      }
      
      setTimeout(() => navigate('/my-listings'), 1000);
    } catch (error) {
      const errorMsg = error.message || 'Failed to save listing. Please check your connection and try again.';
      showToast(errorMsg, 'error');
      
      if (error.message?.includes('Authentication failed')) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {id ? 'Edit Listing' : 'Create New Listing'}
          </Typography>

          {/* Validation Requirements Info */}
          <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Required Information:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ mb: 0, pl: 2 }}>
              <li>Title: Must be filled</li>
              <li>Description: Must be filled</li>
              <li>Price: Must be a valid number (≥ 0)</li>
              <li>Category: Must be selected</li>
              <li>Image: Optional (max 5MB if uploading file)</li>
            </Typography>
          </Alert>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="E.g., iPhone 12 Pro Max"
              required
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {LISTING_CATEGORIES.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Price ($)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              required
              inputProps={{ step: '0.01', min: '0' }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your item in detail..."
              required
              sx={{ mb: 3 }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Upload Image (optional)
              </Typography>
              <Button variant="outlined" component="label" fullWidth>
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Max size: {MAX_IMAGE_SIZE / (1024 * 1024)}MB. Supports JPG, PNG, WEBP
              </Typography>
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{ maxWidth: 300, height: 200, objectFit: 'contain', borderRadius: 1, border: 1, borderColor: 'divider' }}
                  />
                </Box>
              )}
            </Box>

            <TextField
              fullWidth
              label="Or enter Image URL"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => {
                const url = e.target.value;
                setFormData({ ...formData, imageUrl: url });
                handleImageUrl(url);
              }}
              placeholder="https://example.com/image.jpg"
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? 'Saving...' : (id ? 'Update Listing' : 'Create Listing')}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Toast toast={toast} onClose={hideToast} />
    </Container>
  );
};

export default CreateListing;
