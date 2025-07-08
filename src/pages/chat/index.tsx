import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const vendorParam = searchParams.get('vendor');
  const [selectedChat, setSelectedChat] = useState(vendorParam ? parseInt(vendorParam) : null);
  
  // Mock data - in real app, get from auth context
  const currentUserId = 1;
  const currentUserType = 'customer' as const;

  const chats = [
    {
      id: 1,
      name: "Royal Photography Studio",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Thank you for your inquiry!",
      timestamp: "2 min ago",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Elegant Decor Solutions",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      lastMessage: "We can definitely help with your event",
      timestamp: "1 hour ago",
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: "Grand Palace Venues",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      lastMessage: "The venue is available for your date",
      timestamp: "3 hours ago",
      unread: 1,
      online: true
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      
      <div className="pt-20 h-screen flex">
        <ChatSidebar 
          chats={chats}
          selectedChat={chats.find(c => c.id === selectedChat) || null}
          onSelectChat={(chat) => setSelectedChat(chat?.id || null)}
        />
        
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="border-b border-border p-4 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={chats.find(c => c.id === selectedChat)?.avatar} 
                      alt={chats.find(c => c.id === selectedChat)?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {chats.find(c => c.id === selectedChat)?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {chats.find(c => c.id === selectedChat)?.online ? 'Online' : 'Last seen 2 hours ago'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <ChatWindow
                customerId={currentUserId}
                vendorId={selectedChat}
                currentUserType={currentUserType}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a vendor to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
