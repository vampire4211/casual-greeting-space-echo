import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export const useSupabaseCategories = () => {
  const [categories, setCategories] = useState<SupabaseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name, description })
        .select()
        .single();
      
      if (error) throw error;
      
      setCategories(prev => [...prev, data]);
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { 
    categories, 
    loading, 
    error, 
    refetch: fetchCategories,
    addCategory 
  };
};