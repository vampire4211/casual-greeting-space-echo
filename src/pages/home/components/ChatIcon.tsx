
import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatIcon = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          3
        </div>
      </button>
    </div>
  );
};

export default ChatIcon;
