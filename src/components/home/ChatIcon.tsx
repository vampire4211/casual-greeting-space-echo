
import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatIcon = () => {
  const handleChatClick = () => {
    alert('Chat feature will be available soon!');
  };

  return (
    <div 
      className="fixed bottom-8 right-8 w-16 h-16 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      onClick={handleChatClick}
    >
      <MessageCircle className="h-6 w-6 text-white" />
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
        3
      </div>
    </div>
  );
};

export default ChatIcon;
