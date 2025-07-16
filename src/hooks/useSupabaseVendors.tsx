import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseVendor {
  id: string;
  business_name: string;
  vendor_name: string;
  email: string;
  phone_number: string;
  address: string;
  categories: string[];
  created_at: string;
}

export const useSupabaseVendors = (category?: string, location?: string) => {
  const [vendors, setVendors] = useState<SupabaseVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string |null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filter by category if provided
      if (category && category !== 'All') {
        query =query.contains('categories', [category]);
      }
      
      // Filter by location if provided
      if (location && location !== 'All') {
        query = query.ilike('address', `%${location}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setVendors(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [category, location]);

  return { vendors, loading, error, refetch: fetchVendors };
};