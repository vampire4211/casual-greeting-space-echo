import { useState, useEffect } from 'react';

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
      
      let url = 'http://localhost:8000/api/vendors/';
      const params = new URLSearchParams();
      
      if (category && category !== 'All') {
        params.append('category', category);
      }
      
      if (location && location !== 'All') {
        params.append('location', location);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setVendors(data.vendors || []);
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