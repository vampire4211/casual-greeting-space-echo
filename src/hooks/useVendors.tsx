import { useState, useEffect } from 'react';
import { vendorsAPI } from '@/services/api';

export interface Vendor {
  id: number;
  business_name: string;
  vendor_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  categories: string[];
  rating: number;
  total_reviews: number;
  images: string[];
  price_range: string;
  subscription_plan: string;
  created_at: string;
}

export const useVendors = (category?: string, location?: string) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};
      if (category && category !== 'All') params.category = category;
      if (location && location !== 'All') params.location = location;
      
      const response = await vendorsAPI.getVendors(params);
      setVendors(response.data.vendors || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch vendors';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [category, location]);

  return { vendors, loading, error, refetch: fetchVendors };
};