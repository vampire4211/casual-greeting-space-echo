import { useState, useEffect } from 'react';
import { auth } from '@/integrations/supabase/auth';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/integrations/supabase/types';

export interface AuthUser extends User {
  user_type?: 'customer' | 'vendor' | 'admin';
}


export const useSupabaseAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { user: currentUser } = await auth.getCurrentUser();
      
      if (currentUser) {
        const { profile, userType } = await auth.getUserProfile(currentUser.id);
        setUser({
          id: currentUser.id,
          email: currentUser.email!,
          user_type: userType as 'customer' | 'vendor' | 'admin',
          // profile
        });
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { profile, userType } = await auth.getUserProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          user_type: userType as 'customer' | 'vendor' | 'admin',
          // profile
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: UserProfile) => {
    setLoading(true);
    const result = await auth.signUp(email, password, userData);
    setLoading(false);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await auth.signIn(email, password);
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    const result = await auth.signOut();
    setUser(null);
    setLoading(false);
    return result;
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isVendor: user?.user_type === 'vendor',
    isCustomer: user?.user_type === 'customer',
    isAdmin: user?.user_type === 'admin'
  };
};