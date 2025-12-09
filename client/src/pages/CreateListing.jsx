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
  Snackbar
} from '@mui/material';

const API_URL = 'http://localhost:3030';

const CreateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!user) {
      showToast('Please login to create listings', 'error');
      navigate('/login');
      return;
    }

    if (id) {
      fetchListing();
    }
  }, [id, user, navigate]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`${API_URL}/data/listings/${id}`);
      const data = await response.json();

      if (data._ownerId !== user?._id) {
        showToast('You can only edit your own listings', 'error');
        navigate('/catalog');
        return;
      }

      setFormData({
        title: data.title,
        description: data.description,
        price: data.price.toString(),
        category: data.category,
        imageUrl: data.imageUrl || '',
      });
      setImagePreview(data.imageUrl || '');
    } catch (error) {
      showToast('Failed to load listing', 'error');
      navigate('/catalog');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData({ ...formData, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to create listings', 'error');
      navigate('/login');
      return;
    }

    // Validate required fields with specific error messages
    if (!formData.title || !formData.title.trim()) {
      showToast('Title is required. Please enter a title for your listing.', 'error');
      return;
    }

    if (!formData.description || !formData.description.trim()) {
      showToast('Description is required. Please describe your item.', 'error');
      return;
    }

    if (!formData.price || formData.price === '' || isNaN(parseFloat(formData.price))) {
      showToast('Price is required. Please enter a valid number.', 'error');
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (priceValue < 0) {
      showToast('Price cannot be negative. Please enter a valid price.', 'error');
      return;
    }

    if (!formData.category) {
      showToast('Category is required. Please select a category.', 'error');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: priceValue,
        category: formData.category,
        imageUrl: formData.imageUrl || imagePreview || '',
        likes: [],
      };

      const url = id ? `${API_URL}/data/listings/${id}` : `${API_URL}/data/listings`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Server error (${response.status}). Please try again.`;
        
        if (response.status === 401 || response.status === 403) {
          showToast('Authentication failed. Please log in again.', 'error');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      showToast(id ? 'Listing updated successfully!' : 'Listing created successfully!', 'success');
      setTimeout(() => navigate('/my-listings'), 1000);
    } catch (error) {
      console.error('Error saving listing:', error);
      const errorMsg = error.message || 'Failed to save listing. Please check your connection and try again.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, severity) => {
    setToast({ open: true, message, severity });
  };

  const categories = ['Electronics', 'Vehicles', 'Real Estate', 'Furniture', 'Clothing', 'Other'];

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
                {categories.map(cat => (
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
                Max size: 5MB. Supports JPG, PNG, WEBP
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
                setFormData({ ...formData, imageUrl: e.target.value });
                setImagePreview(e.target.value);
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

export default CreateListing;
