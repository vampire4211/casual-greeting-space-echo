
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
      try {
        const { data, error } = await supabase
          .from('chat_conversations')
          .select('id')
          .or(`customer_id.eq.${user.id},vendor_id.eq.${user.id}`)
          .limit(1);

        if (error) {
          console.error('Error checking chat status:', error);
          setHasActiveChats(false);
        } else {
          setHasActiveChats(data && data.length > 0);
        }
      } catch (error) {
        console.error('Error in checkChatStatus:', error);
        setHasActiveChats(false);
      } finally {
        setLoading(false);
      }
    };

    checkChatStatus();
  }, [user]);

  return { hasActiveChats, loading };
};
