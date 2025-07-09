
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
      }
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData
        }
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    }
    return { error };
  };

  const logout = signOut; // Alias for compatibility

  const isAuthenticated = !!user;
  const isVendor = user?.user_metadata?.user_type === 'vendor';

  return {
    user,
    session,
    loading,
    login,
    register,
    signOut,
    logout,
    isAuthenticated,
    isVendor
  };
};
