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
        .from('vendor_details')
        .select(`
          *,
          vendor_id,
          vendors!inner (
            id,
            vendor_name,
            business_name,
            email,
            phone_number,
            address,
            categories,
            created_at
          )
        `);

      if (category && category !== 'All') {
        query = query.contains('vendors.categories', [category]);
      }

      if (location && location !== 'All') {
        query = query.ilike('vendors.address', `%${location}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match the expected format
      const transformedData = data?.map(item => ({
        id: item.vendors.id,
        vendor_name: item.vendors.vendor_name,
        business_name: item.vendors.business_name,
        email: item.vendors.email,
        phone_number: item.vendors.phone_number,
        address: item.vendors.address,
        categories: item.vendors.categories,
        created_at: item.vendors.created_at,
        user_id: null,
        age: null,
        gender: null,
        aadhar: null,
        pan: null,
        gst: null,
        vendor_details: [{
          id: item.id,
          vendor_id: item.vendor_id,
          overall_gr: item.overall_gr,
          no_of_images: item.no_of_images,
          subscription: item.subscription,
          question_com: item.question_com,
          review: item.review,
          email: item.email
        }]
      })) || [];

      setVendors(transformedData);
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