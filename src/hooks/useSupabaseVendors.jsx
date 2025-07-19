import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseVendors = (category, location) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        query = query.contains('categories', [category]);
      }
      
      // Filter by location if provided
      if (location && location !== 'All') {
        query = query.ilike('address', `%${location}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to ensure categories is always an array
      const transformedData = (data || []).map(vendor => ({
        ...vendor,
        categories: Array.isArray(vendor.categories) ? vendor.categories : []
      }));
      
      setVendors(transformedData);
    } catch (err) {
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