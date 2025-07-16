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
      
      const { data, error } = a