import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { validatePassword } from '@/utils/validation';

const Login = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Route guard: redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/catalog');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    const passwordErrors = validatePassword(registerPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]);
      return;
    }
    
    setLoading(true);
    try {
      await register(registerEmail, registerPassword);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, px: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Welcome to MarketPlace
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Login or create an account to get started
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth" sx={{ mb: 3 }}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {tab === 0 && (
            <Box component="form" onSubmit={handleLogin}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Box component="form" onSubmit={handleRegister}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                error={registerPassword.length > 0 && validatePassword(registerPassword).length > 0}
                helperText={
                  registerPassword.length > 0 && validatePassword(registerPassword).length > 0
                    ? validatePassword(registerPassword)[0]
                    : "Must be 6+ chars with uppercase, lowercase, and number"
                }
              />
              {registerPassword.length > 0 && (
                <Alert severity="info" sx={{ mt: 1, mb: 1 }}>
                  <Typography variant="body2" component="div">
                    <strong>Password must include:</strong>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                      <li>At least 6 characters</li>
                      <li>One uppercase letter</li>
                      <li>One lowercase letter</li>
                      <li>One number</li>
                    </ul>
                  </Typography>
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || (registerPassword.length > 0 && validatePassword(registerPassword).length > 0)}
                sx={{ mt: 2 }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link to="/catalog" style={{ color: 'gray', textDecoration: 'none' }}>
              Continue as guest
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
