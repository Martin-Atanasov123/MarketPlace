import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthContext = createContext(undefined);

const API_URL = 'http://localhost:3030';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  useEffect(() => {
  const validateAndRestoreSession = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser.accessToken) {
        localStorage.removeItem('user');
        setUser(null);
        return;
      }

      // NOTE: removed extra curly brace here
      const url = `${API_URL}/users/${parsedUser._id}`;
      try {
        const response = await fetch(url, {
          headers: { 'X-Authorization': parsedUser.accessToken },
        });

        // useful debug logs while developing:
        console.debug('validate token fetch', { url, status: response.status });

        if (!response.ok) {
          console.warn('Token validation failed, clearing user', response.status);
          localStorage.removeItem('user');
          setUser(null);
          return;
        }

        const contentType = response.headers.get('content-type') || '';
        // safe handling: only call json() when content-type looks like JSON
        if (contentType.includes('application/json')) {
          try {
            const userData = await response.json();
            // If server returns empty JSON ({}), merge into parsedUser anyway
            setUser({ ...parsedUser, ...userData });
          } catch (parseErr) {
            // fallback: try text so you can see what server returned
            const text = await response.text();
            console.error('Failed to parse JSON from token validation response:', parseErr, 'raw:', text);
            // decide fallback behavior — keep stored user (optimistic) or clear
            setUser(parsedUser);
          }
        } else {
          // server returned no JSON (maybe 204) — keep the stored user
          console.info('Token validated but no JSON returned; keeping stored user');
          setUser(parsedUser);
        }
      } catch (networkErr) {
        console.error('Network error during token validation:', networkErr);
        // On network error, conservative choice: keep parsed user (you can force re-login on actual failed requests)
        setUser(parsedUser);
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
