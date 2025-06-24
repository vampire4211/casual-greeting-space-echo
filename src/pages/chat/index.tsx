import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import { Send, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

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

  const mockMessages = [
    {
      id: 1,
      sender: "vendor",
      content: "Hello! Thank you for your interest in our photography services. How can I help you today?",
      timestamp: "10:30 AM",
      type: "text"
    },
    {
      id: 2,
      sender: "user",
      content: "Hi! I'm looking for a photographer for my wedding in March. Can you tell me about your packages?",
      timestamp: "10:32 AM",
      type: "text"
    },
    {
      id: 3,
      sender: "vendor",
      content: "Congratulations on your upcoming wedding! We have several packages available. Would you like to see our portfolio first?",
      timestamp: "10:33 AM",
      type: "text"
    },
    {
      id: 4,
      sender: "vendor",
      content: "Here are some samples from recent weddings",
      timestamp: "10:34 AM",
      type: "text"
    }
  ];

  useEffect(() => {
    if (selectedChat) {
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      
      <div className="pt-20 h-screen flex">
        <ChatSidebar 
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
        
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="border-b border-border p-4 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedChat.avatar} 
                      alt={selectedChat.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{selectedChat.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedChat.online ? 'Online' : 'Last seen 2 hours ago'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <ChatWindow 
                messages={messages}
                messagesEndRef={messagesEndRef}
              />
              
              <div className="border-t border-border p-4 bg-card">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button onClick={handleSendMessage} className="bg-primary-700 hover:bg-primary-800">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
