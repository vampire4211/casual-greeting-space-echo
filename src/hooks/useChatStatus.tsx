import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useChatStatus = () => {
  const [hasActiveChats, setHasActiveChats] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Demo mode - always set to false for now
    setHasActiveChats(false);
    setLoading(false);
  }, [user]);

  return { hasActiveChats, loading };
};