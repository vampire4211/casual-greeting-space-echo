import { useState, useEffect } from 'react';
import { categoriesAPI } from '@/services/api';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  subcategories: any[];
  created_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoriesAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch categories';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
};