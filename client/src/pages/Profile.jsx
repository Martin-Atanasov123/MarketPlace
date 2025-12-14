import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Toast } from '@/components/Toast';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const { updateEmail, updatePassword, validatePassword, loading } = useUser();
  const { showToast, hideToast, toast } = useToast();

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) return;

    if (!user) {
      showToast('Please login to access your profile', 'error');
      navigate('/');
      return;
    }
    setEmail(user.email);
  }, [user, navigate, authLoading]);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateEmail(email);
      showToast('Email updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update email', 'error');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!user) return;

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      showToast(passwordErrors[0], 'error');
      return;
    }

    try {
      await updatePassword(newPassword);
      setNewPassword('');
      showToast('Password updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update password', 'error');
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Redirect if not authenticated (handled in useEffect, but show nothing while redirecting)
  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Profile Settings
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>

        {/* Account Info */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Account Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">User ID:</Typography>
                <Typography fontFamily="monospace" fontSize="0.875rem">
                  {user._id}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Current Email:</Typography>
                <Typography>{user.email}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        {/* Email Update */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Email Address
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your email address
            </Typography>
            <Box component="form" onSubmit={handleUpdateEmail}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading || email === user.email}
              >
                {loading ? 'Updating...' : 'Update Email'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Password Update */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your password
            </Typography>
            <Box component="form" onSubmit={handleUpdatePassword}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                error={newPassword.length > 0 && validatePassword(newPassword).length > 0}
                helperText={
                  newPassword.length > 0 && validatePassword(newPassword).length > 0
                    ? validatePassword(newPassword)[0]
                    : "Password must be at least 6 characters with uppercase, lowercase, and number"
                }
                sx={{ mb: 2 }}
              />
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2" component="div">
                  <strong>Password Requirements:</strong>
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                    <li>At least 6 characters long</li>
                    <li>At least one uppercase letter (A-Z)</li>
                    <li>At least one lowercase letter (a-z)</li>
                    <li>At least one number (0-9)</li>
                  </ul>
                </Typography>
              </Alert>
              <Button type="submit" variant="contained" disabled={loading || validatePassword(newPassword).length > 0}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        
      </Box>

      <Toast toast={toast} onClose={hideToast} />
    </Container>
  );
};

export default Profile;
