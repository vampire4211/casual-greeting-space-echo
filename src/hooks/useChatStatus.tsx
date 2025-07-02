
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useChatStatus = () => {
  const [hasActiveChats, setHasActiveChats] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setHasActiveChats(false);
      setLoading(false);
      return;
    }

    const checkChatStatus = async () => {
      // Mock data for demo
      setHasActiveChats(false);
      setLoading(false);
    };

    checkChatStatus();
  }, [user]);

  return { hasActiveChats, loading };
};
