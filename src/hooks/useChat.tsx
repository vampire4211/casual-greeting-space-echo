import { useState, useEffect, useCallback } from 'react';
import { chatService, ChatMessage } from '@/services/chatService';

export const useChat = (customerId: string, vendorId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load chat history and connect to WebSocket
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        
        // Get chat history
        const history = await chatService.getChatHistory(customerId, vendorId);
        setMessages(history);
        
        // Connect to WebSocket
        chatService.connect(customerId, vendorId);
        setIsConnected(true);
        
        // Listen for new messages
        const handleNewMessage = (message: ChatMessage) => {
          setMessages(prev => [...prev, message]);
        };
        
        chatService.onMessage(handleNewMessage);
        
        return () => {
          chatService.removeMessageHandler(handleNewMessage);
        };
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId && vendorId) {
      initializeChat();
    }

    return () => {
      chatService.disconnect();
      setIsConnected(false);
    };
  }, [customerId, vendorId]);

  // Send a message
  const sendMessage = useCallback((message: string, sender: "customer" | "vendor") => {
    if (isConnected && message.trim()) {
      chatService.sendMessage(customerId, vendorId, message.trim(), sender);
    }
  }, [customerId, vendorId, isConnected]);

  return {
    messages,
    sendMessage,
    isConnected,
    loading
  };
};