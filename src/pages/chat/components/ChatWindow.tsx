
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, User, UserCheck } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface ChatWindowProps {
  customerId: number;
  vendorId: number;
  currentUserType: "customer" | "vendor";
}

const ChatWindow = ({ customerId, vendorId, currentUserType }: ChatWindowProps) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isConnected, loading } = useChat(customerId, vendorId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && isConnected) {
      sendMessage(message, currentUserType);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Connection Status */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.sender === currentUserType ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className="flex-shrink-0">
                {msg.sender === 'customer' ? (
                  <User className="h-8 w-8 p-1.5 bg-blue-100 text-blue-600 rounded-full" />
                ) : (
                  <UserCheck className="h-8 w-8 p-1.5 bg-green-100 text-green-600 rounded-full" />
                )}
              </div>
              <Card
                className={`max-w-xs lg:max-w-md px-4 py-3 ${
                  msg.sender === currentUserType
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </Card>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={!isConnected}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!message.trim() || !isConnected}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-1">
            Connection lost. Messages will be sent when reconnected.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
