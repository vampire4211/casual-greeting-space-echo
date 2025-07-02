
import { useState } from 'react';

export const useAuth = () => {
  const [user] = useState(null);
  const [session] = useState(null);
  const [loading] = useState(false);

  const signOut = async () => {
    // Mock sign out
    return { error: null };
  };

  return {
    user,
    session,
    loading,
    signOut
  };
};
