import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthContext = createContext(undefined);

const API_URL = 'http://localhost:3030';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Validate token on mount and refresh
  useEffect(() => {
    const validateAndRestoreSession = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Verify token is still valid by checking with server
          if (parsedUser.accessToken) {
            try {
              const response = await fetch(`${API_URL}/users/me`, {
                headers: {
                  'X-Authorization': parsedUser.accessToken,
                },
              });

              if (response.ok) {
                // Token is valid, restore user
                const userData = await response.json();
                setUser({ ...parsedUser, ...userData });
              } else {
                // Token is invalid, clear storage
                console.warn('Access token expired or invalid');
                localStorage.removeItem('user');
                setUser(null);
              }
            } catch (error) {
              console.error('Failed to validate token:', error);
              // On network error, keep user but it might fail on next request
              setUser(parsedUser);
            }
          } else {
            // No token, clear storage
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateAndRestoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      
      toast.success('Welcome back!');
      navigate('/catalog');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      
      toast.success('Account created successfully!');
      navigate('/catalog');
    } catch (error) {
      toast.error('Registration failed. Email may already be in use.');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
