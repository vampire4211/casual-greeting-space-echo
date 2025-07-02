
import { useState } from 'react';

export const useChatStatus = () => {
  const [hasActiveChats] = useState(false);
  const [loading] = useState(false);

  return { hasActiveChats, loading };
};
