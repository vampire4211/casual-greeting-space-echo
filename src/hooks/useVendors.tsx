import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Vendor = Tables<'vendors'>;
type VendorDetails = Tables<'vendor_details'>;

export interface VendorWithDetails extends Vendor {
  vendor_details?: VendorDetails[];
}

export const useVendors = (category?: string, location?: string) => {
  const [vendors, setVendors] = useState<VendorWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('vendors')
        .select(`
          *,
          vendor_details (*)
        `);

      if (category && category !== 'All') {
        query = query.contains('categories', [category]);
      }

      if (location && location !== 'All') {
        query = query.ilike('address', `%${location}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setVendors(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [category, location]);

  return { vendors, loading, error, refetch: fetchVendors };
};