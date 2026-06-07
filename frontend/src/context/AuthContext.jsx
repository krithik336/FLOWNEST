/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';
import { useToast } from '../components/Toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: jwtToken, user: userData } = response.data;
      
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(jwtToken);
      setUser(userData);
      showToast('Logged in successfully!', 'success');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      await api.post('/api/auth/register', { name, email, password });
      showToast('Registration successful! Please log in.', 'success');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Try again.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.', 'info');
  }, [showToast]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
