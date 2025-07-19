import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
          setSession({ user: data.user });
        }
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          ...userData
        })
      });

      const data = await response.json();

      if (response.ok) {
        return { data, error: null };
      } else {
        return { data: null, error: { message: data.error } };
      }
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error occurred' }
      };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setSession(data.session);
        return { data, error: null };
      } else {
        return { data: null, error: { message: data.error } };
      }
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error occurred' }
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign out failed' } };
    }
  };

  const isAuthenticated = !!user;
  const isVendor = user?.user_type === 'vendor';
  const isCustomer = user?.user_type === 'customer';
  const isAdmin = user?.user_type === 'admin';

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated,
    isVendor,
    isCustomer,
    isAdmin
  };
};