import { supabase } from './client';
import type { User } from '@supabase/supabase-js';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { UserProfile } from '@/integrations/supabase/types';

export interface AuthUser extends User {
  user_type?: 'customer' | 'vendor' | 'admin';
}



export const auth = {
  signUp: async (email: string, password: string, userData: UserProfile) => {
  // Sign up with email and password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userData.user_type || 'customer',
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
        }
      }
    });

    if (error) return { data: null, error };

    // Create profile based on user type
    if (data.user && userData.user_type === 'vendor') {
      const { error: vendorError } = await supabase
        .from('vendors')
        .insert({
          user_id: data.user.id,
          email: email,
          vendor_name: `${userData.first_name} ${userData.last_name}`,
          business_name: userData.business_name || '',
          phone_number: userData.phone,
          categories: userData.categories || [],
          aadhar: userData.aadhaar_number || '',
          pan: userData.pan_number || '',
          gst: userData.gst_number || '',
          address: userData.address || '',
        });

      if (vendorError) console.error('Error creating vendor profile:', vendorError);
    } else if (data.user) {
      const { error: customerError } = await supabase
        .from('customers')
        .insert({
          user_id: data.user.id,
          email: email,
          name: `${userData.first_name} ${userData.last_name}`,
          phone_number: userData.phone,
          gender: userData.gender,
        });

      if (customerError) console.error('Error creating customer profile:', customerError);
    }

    return { data, error: null };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get user profile with type
  getUserProfile: async (userId: string) => {
    // First check if user is a vendor
    const { data: vendor } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (vendor) {
      return { profile: vendor, userType: 'vendor' };
    }

    // Then check if user is a customer
    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (customer) {
      return { profile: customer, userType: 'customer' };
    }

    return { profile: null, userType: null };
  },

  // Listen to auth changes
 onAuthStateChange: (
  callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
  return supabase.auth.onAuthStateChange(callback);
}

};