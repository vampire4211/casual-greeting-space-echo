
import { useState, useEffect } from 'react';
import { authAPI } from '@/services/api';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Get user profile
        const profileResponse = await authAPI.getProfile();
        const userData = profileResponse.data;
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return { data: userData, error: null };
      }
    } catch (error: any) {
      return { 
        data: null, 
        error: { message: error.response?.data?.detail || 'Login failed' }
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    setLoading(true);
    try {
      const response = await authAPI.register({
        email,
        password,
        ...userData
      });
      
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: { message: error.response?.data?.detail || 'Registration failed' }
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    return { error: null };
  };

  const logout = signOut; // Alias for compatibility

  const isAuthenticated = !!user;
  const isVendor = user?.user_type === 'vendor';

  return {
    user,
    loading,
    login,
    register,
    signOut,
    logout,
    isAuthenticated,
    isVendor
  };
};
